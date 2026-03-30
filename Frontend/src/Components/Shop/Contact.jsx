import React, { useState } from "react";

const Contact = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccess("");
        setError("");

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.message || "Failed to send message.");
            }

            setSuccess("Your message has been sent successfully.");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            setError(err.message || "Failed to send message.");
        } finally {
            setSubmitting(false);
        }
    };

	return (
           <main>
               {/* Contact Section Begin */}
               <section className="contact spad">
                   <div className="container">
                       <div className="row">
                           <div className="col-lg-6 col-md-6">
                               <div className="contact__content">
                                   <div className="contact__address">
                                       <h5>Contact info</h5>
                                       <ul>
                                           <li>
                                               <h6><i className="fa fa-map-marker"></i> Address</h6>
                                               <p>Ajman, UAE</p>
                                           </li>
                                           <li>
                                               <h6><i className="fa fa-phone"></i> Phone</h6>
                                               <p><span>123-123-123</span><span>123-123-123</span></p>
                                           </li>
                                           <li>
                                               <h6><i className="fa fa-headphones"></i> Support</h6>
                                               <p>Support.Abcd@gmail.com</p>
                                           </li>
                                       </ul>
                                   </div>
                                   <div className="contact__form">
                                       <h5>SEND MESSAGE</h5>
                                       <form onSubmit={handleSubmit}>
										   {success && <div className="alert alert-success">{success}</div>}
										   {error && <div className="alert alert-danger">{error}</div>}
										   <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
										   <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
										   <input type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" />
										   <textarea name="message" value={form.message} onChange={handleChange} placeholder="Message" required></textarea>
										   <button type="submit" className="site-btn" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</button>
                                       </form>
                                   </div>
                               </div>
                           </div>
                           <div className="col-lg-6 col-md-6"> 
    <div className="contact__map">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115329.38622641827!2d55.52594935!3d25.403360499999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5764dd8fbe79%3A0xcda090de6445a819!2sAjman!5e0!3m2!1sen!2sae!4v1764321679034!5m2!1sen!2sae"
            width="100%"
            height="780"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ajman Map"
        ></iframe>
    </div>
</div>

                       </div>
                   </div>
               </section>
               {/* Contact Section End */}
           </main>
	);
};

export default Contact;
