import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { EarthCanvas } from "./canvas";
import { SectionWrapper } from "../hoc";
import { slideIn } from "../utils/motion";

const Contact = () => {
  return (
    <div
      className={`xl:mt-12 flex xl:flex-row flex-col-reverse gap-10 overflow-hidden`}
    >
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <div className="flex gap-8 flex-col items-start justify-between" style={{marginTop: "32px"}}>
          <button
            type="button"
            onClick={() =>
              window.open("https://www.linkedin.com/in/yasinkamis", "_blank")
            }
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary"
          >
            Linkedin
          </button>
          <button
            type="button"
            onClick={() =>
              window.open("https://github.com/yasinkamis", "_blank")
            }
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary"
          >
            Github
          </button>
          <button
            type="button"
            onClick={() =>
              (window.location.href =
                "mailto:yasin-kamis90@outlook.com?subject=&body=")
            }
            className="bg-tertiary py-3 px-8 rounded-xl outline-none w-full text-white font-bold shadow-md shadow-primary"
          >
            Mail
          </button>
        </div>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact");
