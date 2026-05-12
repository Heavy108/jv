import Link from "next/link";
import styles from "@/css/footer.module.css";
import Image from "next/image";
import logo from "@/assets/logo.png"
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandSection}>
          <div className={styles.logo}>
            <Image src={logo} width={200} height={100} alt="jv venture logo" />
          </div>
          <p className={styles.description}>
            JV Ventures builds social infrastructure platforms that compound
            capital, capability, and long term impact.
          </p>
        </div>
<div className={styles.intro}>
        {/* --- COMPANY SECTION --- */}
        <div className={styles.linkSection}>
          <h4 className={styles.heading}>COMPANY</h4>
          <ul className={styles.linkList}>
            <li>
              <Link href="#">About Us</Link>
            </li>
            <li>
              <Link href="#">Contact Us</Link>
            </li>
          </ul>
        </div>

        {/* --- PLATFORMS SECTION --- */}
        <div className={styles.linkSection}>
          <h4 className={styles.heading}>PLATFORMS</h4>
          <ul className={styles.platformGrid}>
            <li>
              <Link href="#">PowerED</Link>
            </li>
            <li>
              <Link href="#">PowerPod</Link>
            </li>
            <li>
              <Link href="#">PowerX</Link>
            </li>
            {/* <li>
              <Link href="#">PowerCare</Link>
            </li> */}
          </ul>
        </div>
</div>
        {/* --- CONTACT SECTION --- */}
        <div className={styles.linkSection}>
          <h4 className={styles.heading}>CONTACT US</h4>
          <div className={styles.contactItem}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2"></rect>
              <path d="M2 6l10 7 10-7"></path>
            </svg>
            <a href="mailto:connect@jv.ventures">connect@jv.ventures</a>
          </div>
          <div className={styles.contactItem}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>India · Dubai · Singapore</span>
          </div>
        </div>

        {/* --- SOCIAL LINKS --- */}
        <div className={styles.social}>
        <div className={styles.socialSection}>
          <a href="#" aria-label="LinkedIn" className={styles.socialIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect
                width="32"
                height="32"
                rx="4"
                fill="white"
                fillOpacity="0.1"
              />
              <path
                d="M8.79 10.7775C8.4141 10.4284 8.22656 9.99648 8.22656 9.48258C8.22656 8.96867 8.4141 8.51728 8.79 8.16818C9.1659 7.81908 9.64977 7.64453 10.2433 7.64453C10.8367 7.64453 11.3011 7.81908 11.6762 8.16818C12.0521 8.51728 12.2397 8.95568 12.2397 9.48258C12.2397 10.0095 12.0521 10.4284 11.6762 10.7775C11.3003 11.1266 10.8229 11.3011 10.2433 11.3011C9.66358 11.3011 9.1659 11.1266 8.79 10.7775ZM11.923 12.7795V23.4773H8.54319V12.7795H11.923Z"
                fill="#FEFFFC"
              />
              <path
                d="M23.1757 13.835C23.9121 14.6347 24.2807 15.7331 24.2807 17.1312V23.2883H21.0697V17.5655C21.0697 16.8608 20.887 16.3128 20.5217 15.9223C20.1563 15.5318 19.6652 15.337 19.0481 15.337C18.4311 15.337 17.9399 15.5326 17.5745 15.9223C17.2092 16.3128 17.0265 16.8608 17.0265 17.5655V23.2883H13.7969V12.7496H17.0265V14.1476C17.3537 13.6816 17.7946 13.3138 18.3491 13.0426C18.9028 12.7723 19.5263 12.6367 20.2189 12.6367C21.4529 12.6367 22.4385 13.037 23.1749 13.8358L23.1757 13.835Z"
                fill="#FEFFFC"
              />
            </svg>
          </a>
          {/* <a href="#" aria-label="X (Twitter)" className={styles.socialIcon}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <rect
                width="32"
                height="32"
                rx="4"
                fill="white"
                fillOpacity="0.1"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12.5016 8.38281H7.21875L13.4823 16.613L7.61943 23.5171H10.3283L14.7626 18.2953L18.7001 23.4691H23.9829L17.5373 14.9998L17.5487 15.0144L23.0985 8.47896H20.3896L16.2683 13.3323L12.5016 8.38281ZM10.1348 9.82418H11.7794L21.0669 22.0277H19.4223L10.1348 9.82418Z"
                fill="white"
              />
            </svg>
          </a> */}
        </div>

        {/* --- BOTTOM LEGAL --- */}
        <div className={styles.bottomSection}>
          <Link href="#" className={styles.privacy}>
            Privacy Policy
          </Link>
          <p className={styles.copyright}>
            © 2026 All rights reserved · JV Ventures
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}
