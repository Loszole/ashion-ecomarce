$base = 'http://localhost:5000/api'
$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$email = "smoke$stamp@example.com"
$password = 'SmokePass123!'
$results = @()

function Add-Result($step, $ok, $detail) {
  $script:results += [PSCustomObject]@{
    step = $step
    ok = $ok
    detail = $detail
  }
}

try {
  $registerBody = @{ name = 'Smoke User'; email = $email; password = $password } | ConvertTo-Json
  $registerResp = Invoke-WebRequest -UseBasicParsing -Uri "$base/auth/register" -Method Post -ContentType 'application/json' -Body $registerBody
  Add-Result 'register' ($registerResp.StatusCode -eq 201) ("status=$($registerResp.StatusCode)")
} catch {
  Add-Result 'register' $false $_.Exception.Message
}

$token = $null
$refreshToken = $null
try {
  $loginBody = @{ email = $email; password = $password } | ConvertTo-Json
  $loginResp = Invoke-RestMethod -Uri "$base/auth/login" -Method Post -ContentType 'application/json' -Body $loginBody
  $token = $loginResp.accessToken
  $refreshToken = $loginResp.refreshToken
  Add-Result 'login' (![string]::IsNullOrWhiteSpace($token)) 'accessToken received'
} catch {
  Add-Result 'login' $false $_.Exception.Message
}

if ($refreshToken) {
  try {
    $refreshBody = @{ refreshToken = $refreshToken } | ConvertTo-Json
    $refreshResp = Invoke-RestMethod -Uri "$base/auth/refresh" -Method Post -ContentType 'application/json' -Body $refreshBody
    $hasToken = -not [string]::IsNullOrWhiteSpace($refreshResp.accessToken)
    Add-Result 'refresh token' $hasToken 'new access token received'
    if ($hasToken) { $token = $refreshResp.accessToken }
  } catch {
    Add-Result 'refresh token' $false $_.Exception.Message
  }
}

$product = $null
try {
  $productsResp = Invoke-RestMethod -Uri "$base/products?page=1&limit=1" -Method Get
  $product = $productsResp.data | Select-Object -First 1
  Add-Result 'list products' ($null -ne $product -and $null -ne $product._id) ("productId=$($product._id)")
} catch {
  Add-Result 'list products' $false $_.Exception.Message
}

$order = $null
if ($token -and $product) {
  try {
    $orderBody = @{
      products = @(@{ product = $product._id; quantity = 1 })
      shippingAddress = '123 Smoke Street, Test City'
      paymentMethod = 'cod'
      shippingCost = 0
      taxAmount = 0
      contactName = 'Smoke User'
      contactEmail = $email
      contactPhone = '1234567890'
    } | ConvertTo-Json -Depth 6

    $orderResp = Invoke-RestMethod -Uri "$base/orders" -Method Post -Headers @{ Authorization = "Bearer $token" } -ContentType 'application/json' -Body $orderBody
    $order = $orderResp
    Add-Result 'checkout/order create' ($null -ne $order._id) ("orderId=$($order._id)")
  } catch {
    Add-Result 'checkout/order create' $false $_.Exception.Message
  }
}

if ($token) {
  try {
    $myOrders = Invoke-RestMethod -Uri "$base/orders/my?page=1&limit=5" -Method Get -Headers @{ Authorization = "Bearer $token" }
    $count = @($myOrders.data).Count
    Add-Result 'my orders' ($count -ge 1) ("count=$count")
  } catch {
    Add-Result 'my orders' $false $_.Exception.Message
  }
}

if ($order) {
  try {
    $trackBody = @{ orderId = $order._id; email = $email } | ConvertTo-Json
    $trackResp = Invoke-RestMethod -Uri "$base/orders/track" -Method Post -ContentType 'application/json' -Body $trackBody
    $tracked = $trackResp.data
    Add-Result 'track order' ($null -ne $tracked._id) ("status=$($tracked.status)")
  } catch {
    Add-Result 'track order' $false $_.Exception.Message
  }
}

if ($token) {
  try {
    Invoke-WebRequest -UseBasicParsing -Uri "$base/admin/summary" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop | Out-Null
    Add-Result 'admin summary role guard' $false 'unexpected success for user role'
  } catch {
    $msg = $_.Exception.Message
    $isForbidden = ($msg -match '403') -or ($msg -match 'Forbidden')
    Add-Result 'admin summary role guard' $isForbidden $msg
  }

  try {
    Invoke-WebRequest -UseBasicParsing -Uri "$base/orders/list?page=1&limit=5" -Method Get -Headers @{ Authorization = "Bearer $token" } -ErrorAction Stop | Out-Null
    Add-Result 'admin orders role guard' $false 'unexpected success for user role'
  } catch {
    $msg = $_.Exception.Message
    $isForbidden = ($msg -match '403') -or ($msg -match 'Forbidden')
    Add-Result 'admin orders role guard' $isForbidden $msg
  }
}

$results | Format-Table -AutoSize
$failed = @($results | Where-Object { -not $_.ok }).Count
Write-Output "SMOKE_SUMMARY total=$($results.Count) failed=$failed"
