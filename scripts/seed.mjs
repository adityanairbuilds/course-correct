/**
 * Firestore seed script — run once to populate schools and courses.
 *
 * Usage:
 *   1. npm install -g firebase-tools   (if you haven't already)
 *   2. Fill in your Firebase config below.
 *   3. node scripts/seed.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, writeBatch } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9cqd8Dn7HNIJiTFXez6DmY2J0kVZgt8c",
  authDomain: "ratemycourse-e0b8d.firebaseapp.com",
  projectId: "ratemycourse-e0b8d",
  storageBucket: "ratemycourse-e0b8d.firebasestorage.app",
  messagingSenderId: "346469082620",
  appId: "1:346469082620:web:165b495ae392315cfa3e79",
  measurementId: "G-0TVBZTZ774"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ─── Schools ────────────────────────────────────────────────────────────────
const schools = [
  { id: "del_norte_hs", name: "Del Norte High School", city: "San Diego", state: "CA" },
];

// ─── Courses ─────────────────────────────────────────────────────────────────
// Source: https://delnorte.powayusd.com/apps/pages/index.jsp?uREC_ID=3737173&type=d&pREC_ID=2434190
const courses = [
  // English
  { id: "dn_eng1",          schoolId: "del_norte_hs", department: "English", name: "High School English 1" },
  { id: "dn_eng1h",         schoolId: "del_norte_hs", department: "English", name: "Honors High School English 1" },
  { id: "dn_eng2",          schoolId: "del_norte_hs", department: "English", name: "High School English 2" },
  { id: "dn_eng_hum",       schoolId: "del_norte_hs", department: "English", name: "Honors Humanities" },
  { id: "dn_ap_seminar",    schoolId: "del_norte_hs", department: "English", name: "AP Seminar" },
  { id: "dn_am_lit",        schoolId: "del_norte_hs", department: "English", name: "American Literature" },
  { id: "dn_eth_lit",       schoolId: "del_norte_hs", department: "English", name: "Ethnic Literature" },
  { id: "dn_erwc",          schoolId: "del_norte_hs", department: "English", name: "Expository Reading and Writing" },
  { id: "dn_world_lit",     schoolId: "del_norte_hs", department: "English", name: "World Literature" },
  { id: "dn_ap_lang",       schoolId: "del_norte_hs", department: "English", name: "AP English Language & Composition" },
  { id: "dn_ap_lit",        schoolId: "del_norte_hs", department: "English", name: "AP English Literature & Composition" },

  // Mathematics
  { id: "dn_math_accel",    schoolId: "del_norte_hs", department: "Mathematics", name: "Accelerated Math" },
  { id: "dn_im1",           schoolId: "del_norte_hs", department: "Mathematics", name: "Integrated Math 1" },
  { id: "dn_im2",           schoolId: "del_norte_hs", department: "Mathematics", name: "Integrated Math 2" },
  { id: "dn_im23",          schoolId: "del_norte_hs", department: "Mathematics", name: "Compacted Integrated Math 2-3" },
  { id: "dn_im3",           schoolId: "del_norte_hs", department: "Mathematics", name: "Integrated Math 3" },
  { id: "dn_trig",          schoolId: "del_norte_hs", department: "Mathematics", name: "Trigonometry" },
  { id: "dn_coll_alg",      schoolId: "del_norte_hs", department: "Mathematics", name: "College Algebra" },
  { id: "dn_ap_precalc",    schoolId: "del_norte_hs", department: "Mathematics", name: "AP Pre-Calculus" },
  { id: "dn_precalc",       schoolId: "del_norte_hs", department: "Mathematics", name: "Pre-Calculus" },
  { id: "dn_bridge_calc",   schoolId: "del_norte_hs", department: "Mathematics", name: "Bridge to AP Calculus BC" },
  { id: "dn_ap_calc_ab",    schoolId: "del_norte_hs", department: "Mathematics", name: "AP Calculus AB" },
  { id: "dn_ap_calc_bc",    schoolId: "del_norte_hs", department: "Mathematics", name: "AP Calculus BC" },
  { id: "dn_ap_stats",      schoolId: "del_norte_hs", department: "Mathematics", name: "AP Statistics" },

  // Science
  { id: "dn_bio",           schoolId: "del_norte_hs", department: "Science", name: "Biology of the Living Earth" },
  { id: "dn_ap_bio",        schoolId: "del_norte_hs", department: "Science", name: "AP Biology" },
  { id: "dn_biomed1",       schoolId: "del_norte_hs", department: "Science", name: "Honors Principles of Biomedical Sciences" },
  { id: "dn_biomed2",       schoolId: "del_norte_hs", department: "Science", name: "Honors Human Body Systems" },
  { id: "dn_biomed3",       schoolId: "del_norte_hs", department: "Science", name: "Honors Medical Interventions" },
  { id: "dn_phys_chem",     schoolId: "del_norte_hs", department: "Science", name: "Fundamentals of Physics and Chemistry" },
  { id: "dn_chem",          schoolId: "del_norte_hs", department: "Science", name: "Chemistry in the Earth System" },
  { id: "dn_physics",       schoolId: "del_norte_hs", department: "Science", name: "Physics of the Universe" },
  { id: "dn_marine",        schoolId: "del_norte_hs", department: "Science", name: "Marine Science" },
  { id: "dn_ap_chem",       schoolId: "del_norte_hs", department: "Science", name: "AP Chemistry" },
  { id: "dn_ap_env",        schoolId: "del_norte_hs", department: "Science", name: "AP Environmental Science" },
  { id: "dn_ap_phys_mech",  schoolId: "del_norte_hs", department: "Science", name: "AP Physics C: Mechanics" },
  { id: "dn_ap_phys_em",    schoolId: "del_norte_hs", department: "Science", name: "AP Physics C: Electricity & Magnetism" },

  // Social Science
  { id: "dn_world_hist",    schoolId: "del_norte_hs", department: "Social Science", name: "World History" },
  { id: "dn_ap_world",      schoolId: "del_norte_hs", department: "Social Science", name: "AP World History" },
  { id: "dn_world_geo",     schoolId: "del_norte_hs", department: "Social Science", name: "World Geography and Cultures" },
  { id: "dn_us_hist",       schoolId: "del_norte_hs", department: "Social Science", name: "US History" },
  { id: "dn_ap_ush",        schoolId: "del_norte_hs", department: "Social Science", name: "AP US History" },
  { id: "dn_civics",        schoolId: "del_norte_hs", department: "Social Science", name: "Civics" },
  { id: "dn_econ",          schoolId: "del_norte_hs", department: "Social Science", name: "Economics" },
  { id: "dn_ap_gov",        schoolId: "del_norte_hs", department: "Social Science", name: "AP US Government & Politics" },
  { id: "dn_ap_hug",        schoolId: "del_norte_hs", department: "Social Science", name: "AP Human Geography" },

  // World Language — Chinese
  { id: "dn_chinese1",      schoolId: "del_norte_hs", department: "World Language", name: "Chinese 1" },
  { id: "dn_chinese2",      schoolId: "del_norte_hs", department: "World Language", name: "Chinese 2" },
  { id: "dn_chinese3",      schoolId: "del_norte_hs", department: "World Language", name: "Chinese 3" },
  { id: "dn_chinese4",      schoolId: "del_norte_hs", department: "World Language", name: "Chinese 4" },
  { id: "dn_chinese5",      schoolId: "del_norte_hs", department: "World Language", name: "Chinese 5" },
  { id: "dn_ap_chinese",    schoolId: "del_norte_hs", department: "World Language", name: "AP Chinese Language" },
  // World Language — Spanish
  { id: "dn_spanish1",      schoolId: "del_norte_hs", department: "World Language", name: "Spanish 1" },
  { id: "dn_spanish2",      schoolId: "del_norte_hs", department: "World Language", name: "Spanish 2" },
  { id: "dn_spanish3",      schoolId: "del_norte_hs", department: "World Language", name: "Spanish 3" },
  { id: "dn_spanish4",      schoolId: "del_norte_hs", department: "World Language", name: "Spanish 4" },
  { id: "dn_ap_spanish",    schoolId: "del_norte_hs", department: "World Language", name: "AP Spanish Language" },

  // Fine Arts — Visual
  { id: "dn_draw_paint1",   schoolId: "del_norte_hs", department: "Fine Arts", name: "Drawing and Painting 1" },
  { id: "dn_draw_paint2",   schoolId: "del_norte_hs", department: "Fine Arts", name: "Drawing and Painting 2" },
  { id: "dn_anim1",         schoolId: "del_norte_hs", department: "Fine Arts", name: "3D Computer Animation 1" },
  { id: "dn_anim2",         schoolId: "del_norte_hs", department: "Fine Arts", name: "3D Computer Animation 2" },
  { id: "dn_game_design",   schoolId: "del_norte_hs", department: "Fine Arts", name: "Art of Game Design" },
  { id: "dn_ceramics1",     schoolId: "del_norte_hs", department: "Fine Arts", name: "Ceramics 1" },
  { id: "dn_ceramics2",     schoolId: "del_norte_hs", department: "Fine Arts", name: "Ceramics 2" },
  { id: "dn_design_media",  schoolId: "del_norte_hs", department: "Fine Arts", name: "Design Mixed Media" },
  { id: "dn_dig_media1",    schoolId: "del_norte_hs", department: "Fine Arts", name: "Digital Media Production 1" },
  { id: "dn_dig_media2",    schoolId: "del_norte_hs", department: "Fine Arts", name: "Digital Media Production 2" },
  { id: "dn_photo1",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Digital Photography 1" },
  { id: "dn_photo2",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Digital Photography 2" },
  { id: "dn_photo3",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Digital Photography 3" },
  { id: "dn_ap_studio_art", schoolId: "del_norte_hs", department: "Fine Arts", name: "AP Studio Art" },
  // Fine Arts — Performing
  { id: "dn_drama1",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Drama 1" },
  { id: "dn_drama2",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Drama 2" },
  { id: "dn_drama3",        schoolId: "del_norte_hs", department: "Fine Arts", name: "Drama 3" },
  { id: "dn_theatre_tech",  schoolId: "del_norte_hs", department: "Fine Arts", name: "Theatre Technical Production" },
  { id: "dn_concert_band",  schoolId: "del_norte_hs", department: "Fine Arts", name: "Concert Band" },
  { id: "dn_orchestra",     schoolId: "del_norte_hs", department: "Fine Arts", name: "Orchestra" },
  { id: "dn_chamber_orch",  schoolId: "del_norte_hs", department: "Fine Arts", name: "Chamber Orchestra" },
  { id: "dn_wind_ens",      schoolId: "del_norte_hs", department: "Fine Arts", name: "Wind Ensemble" },
  { id: "dn_sym_band",      schoolId: "del_norte_hs", department: "Fine Arts", name: "Symphonic Band" },
  { id: "dn_ap_music",      schoolId: "del_norte_hs", department: "Fine Arts", name: "AP Music Theory" },
  { id: "dn_choir",         schoolId: "del_norte_hs", department: "Fine Arts", name: "Concert Choir" },
  { id: "dn_vocal_ens",     schoolId: "del_norte_hs", department: "Fine Arts", name: "Classical Vocal Ensemble" },
  { id: "dn_tall_flags",    schoolId: "del_norte_hs", department: "Fine Arts", name: "Tall Flags / Dance Props" },

  // Electives
  { id: "dn_avid1",         schoolId: "del_norte_hs", department: "Electives", name: "AVID 1" },
  { id: "dn_avid2",         schoolId: "del_norte_hs", department: "Electives", name: "AVID 2" },
  { id: "dn_avid3",         schoolId: "del_norte_hs", department: "Electives", name: "AVID 3" },
  { id: "dn_avid_sr",       schoolId: "del_norte_hs", department: "Electives", name: "AVID Senior Seminar" },
  { id: "dn_eth_studies",   schoolId: "del_norte_hs", department: "Electives", name: "Ethnic Studies" },
  { id: "dn_biz_law",       schoolId: "del_norte_hs", department: "Electives", name: "Business Law" },
  { id: "dn_finance",       schoolId: "del_norte_hs", department: "Electives", name: "Introduction to Finance" },
  { id: "dn_marketing",     schoolId: "del_norte_hs", department: "Electives", name: "Marketing Economics" },
  { id: "dn_child_dev1",    schoolId: "del_norte_hs", department: "Electives", name: "Child Development and Psychology 1" },
  { id: "dn_child_dev2",    schoolId: "del_norte_hs", department: "Electives", name: "Child Development and Psychology 2" },
  { id: "dn_robotics",      schoolId: "del_norte_hs", department: "Electives", name: "Robotics" },
  { id: "dn_engr_design",   schoolId: "del_norte_hs", department: "Electives", name: "Honors Introduction to Engineering Design" },
  { id: "dn_engr_princ",    schoolId: "del_norte_hs", department: "Electives", name: "Honors Principles of Engineering" },
  { id: "dn_cs_swe",        schoolId: "del_norte_hs", department: "Electives", name: "Computer Science and Software Engineering" },
  { id: "dn_ap_csp",        schoolId: "del_norte_hs", department: "Electives", name: "AP Computer Science Principles" },
  { id: "dn_ap_csa",        schoolId: "del_norte_hs", department: "Electives", name: "AP Computer Science A" },
  { id: "dn_ap_psych",      schoolId: "del_norte_hs", department: "Electives", name: "AP Psychology" },
  { id: "dn_yearbook",      schoolId: "del_norte_hs", department: "Electives", name: "Yearbook" },
  { id: "dn_link_crew",     schoolId: "del_norte_hs", department: "Electives", name: "Link Crew Leadership" },
  { id: "dn_asb",           schoolId: "del_norte_hs", department: "Electives", name: "ASB" },

  // Physical Education
  { id: "dn_pe",            schoolId: "del_norte_hs", department: "Physical Education", name: "Physical Education" },
  { id: "dn_racquet",       schoolId: "del_norte_hs", department: "Physical Education", name: "Racquet Sports" },
  { id: "dn_weights",       schoolId: "del_norte_hs", department: "Physical Education", name: "Weight Training" },
  { id: "dn_march_band_pe", schoolId: "del_norte_hs", department: "Physical Education", name: "Marching Band PE" },
];

async function seed() {
  console.log("Seeding schools...");
  for (const school of schools) {
    const { id, ...data } = school;
    await setDoc(doc(db, "schools", id), data);
    console.log(`  ✓ ${data.name}`);
  }

  console.log("\nSeeding courses in batches...");
  // Firestore batch write limit is 500 ops
  let batch = writeBatch(db);
  let count = 0;

  for (const course of courses) {
    const { id, ...data } = course;
    batch.set(doc(db, "courses", id), data);
    count++;
    if (count === 499) {
      await batch.commit();
      batch = writeBatch(db);
      count = 0;
    }
  }

  if (count > 0) await batch.commit();

  console.log(`  ✓ ${courses.length} courses seeded`);
  console.log("\nDone!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
