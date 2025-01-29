import styles from './Aside.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons'

export default function Aside() {
  return (
    <div className={styles.aside}>
      <div className={styles.imgContainer}>
        {/* Replacing next/image with a standard <img> tag */}
        <img src="/img/vaas-white.png" alt="vass" width="140" height="70" />
      </div>
      <ul className={styles.ul}>
        <li className={styles.li}>Overview</li>
        {/* <li className={styles.li}>Add Agent</li> */}
        <li className={styles.li}>Setup Agents</li>
        {/* <li className={styles.li}>Add User</li> */}
        <li className={styles.li}>Manage User</li>
      </ul>
      <div className={styles.bottom}>
        <p>Feedback | Contact</p>
        <a href="https://www.linkedin.com/in/kirubel-d-71684b292/">
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
        <p>Client Portal</p>
        <a href="https://vaas-alpha.vercel.app/client">
          https://vaas-alpha.vercel.app/client
        </a>
        <br />
        {/* <button>Profile</button> */}
        {/* <p>Powered by VAAS</p> */}
      </div>
    </div>
  )
}
