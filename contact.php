<?php include 'components/header.php'; ?>
<?php include 'components/slide-menu.php'; ?>
<main>
    <div class="contact-main-title fade-in">Let's Build Something Great Together</div>
    <div class="contact-map scale-in delay-200">
        <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7689.625353006377!2d73.833284!3d15.494505000000002!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfc1870bd62f33%3A0x6f779ece0ea56530!2sGera&#39;s%20Imperium%20Star!5e0!3m2!1sen!2sin!4v1758826154572!5m2!1sen!2sin"
            width="1200" height="450" style="border:0;" allowfullscreen="" loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
    <section class="contact-card-section">
        <div class="contact-card-address-row contact-card-address-full slide-up delay-300">
            <div class="contact-side-label classy-label fade-in-left delay-400">KEEP IN TOUCH</div>
            <div class="contact-info-block classy-info">
                <h3 class="contact-info-reveal delay-500">Vizstar Builders & Realtors OPC Pvt Ltd</h3>
                <address class="contact-info-reveal delay-600">
                    Office No 240, Second Floor <br>Gera Star - Patto, Panjim<br>Goa - 403001
                </address>
                <div class="contact-info-row contact-info-reveal delay-700">
                    <span class="contact-label">Email:</span>
                    <a href="mailto:info@vizstar.co" class="contact-email">support@vizstar.com</a>
                </div>
            </div>
            <div class="contact-info-block classy-info">
                <div class="contact-phone contact-info-reveal delay-500">+91-98231 72025</div>
                <div class="contact-label contact-info-reveal delay-600">Work Hours</div>
                <div class="contact-hours contact-info-reveal delay-700">Monday - Saturday  : 09:00 AM - 06:00 PM<br>Sunday Closed</div>
                <div class="contact-label contact-info-reveal delay-800">Follow us</div>
                <div class="contact-follow contact-info-reveal delay-900">
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                </div>
            </div>
        </div>
    </section>
    <section>
        <div class="contact-card-form-row contact-form-flex fade-in-right delay-400">
            <div class="contact-side-label classy-label slide-up delay-500">MESSAGE US</div>
            <div class="contact-form-block classy-form" style="position: relative;">
                <form class="contact-form" autocomplete="off">
                    <div class="contact-form-row">
                        <input type="text" name="name" placeholder="Name*" required class="fade-in delay-600">
                        <input type="email" name="email" placeholder="Email*" required class="fade-in delay-700">
                        <input type="text" name="subject" placeholder="Subject (Optional)" class="fade-in delay-800">
                    </div>
                    <textarea name="message" placeholder="Message*" required class="fade-in delay-900"></textarea>
                    <button type="submit" class="scale-in delay-1000">SEND MESSAGE</button>
                </form>
                <div class="form-loading-bar"></div>
            </div>
        </div>
    </section>
</main>
<?php include 'components/footer.php'; ?>
<script src="assets/main.js"></script>
