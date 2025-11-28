import React from "react";

const Wishlist = () => {
  return (
    <div>
      {/* Breadcrumb Begin */}
      <div className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__links">
                <a href="./index.html"><i className="fa fa-home"></i> Home</a>
                <span>Wishlist</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Breadcrumb End */}

      {/* Wishlist Section Begin */}
      <section className="shop-cart spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="shop__cart__table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Empty state row */}
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: 18, color: '#888' }}>
                          <i className="fa fa-heart-o" style={{ fontSize: 32, marginBottom: 10 }}></i>
                          <div>Your wishlist is currently empty.</div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-6">
              <div className="cart__btn">
                <a href="#">Continue Shopping</a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Wishlist Section End */}
    </div>
  );
};

export default Wishlist;
