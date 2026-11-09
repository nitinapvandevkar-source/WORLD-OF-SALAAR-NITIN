import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate
} from "react-router-dom";

import "./App.css";

import audio01 from "./assets/audio/audio-01.mp3";

/* =========================================================
   ASSET LOADER
========================================================= */

const images = import.meta.glob(
  "./assets/**/*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default"
  }
);

function getImage(fileName) {
  const match = Object.entries(images).find(([path]) =>
    path.toLowerCase().endsWith("/" + fileName.toLowerCase())
  );

  return match ? match[1] : "";
}

function getFolderImage(folder, preferredName = "") {
  const folderPath = `/assets/${folder.toLowerCase()}/`;
  const matches = Object.entries(images).filter(([path]) =>
    path.toLowerCase().includes(folderPath)
  );
  const preferred = preferredName
    ? matches.find(([path]) => path.toLowerCase().includes(preferredName.toLowerCase()))
    : null;
  return (preferred || matches[0] || [null, ""])[1];
}

/* =========================================================
   AUDIO SYSTEM — AUDIO 01 ONLY
   Starts at 00:46, plays through the end, then restarts at 00:46.
========================================================= */

const MusicContext = createContext(null);

function MusicProvider({ children }) {
  const audioRef = useRef(null);
  const started = useRef(false);
  const mutedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio(audio01);
    audio.preload = "auto";
    audio.loop = false;
    audioRef.current = audio;

    const restartFromIntroSegment = () => {
      audio.currentTime = 46;
      audio.play().catch((error) => console.error("Unable to restart music:", error));
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener("ended", restartFromIntroSegment);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("ended", restartFromIntroSegment);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audioRef.current = null;
    };
  }, []);

  const startMusic = async () => {
    const audio = audioRef.current;
    if (!audio || started.current) return;
    started.current = true;
    audio.currentTime = 46;
    audio.muted = mutedRef.current;
    try {
      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      started.current = false;
      console.error("Unable to start music:", error);
    }
  };

  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setIsMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  return (
    <MusicContext.Provider value={{ startMusic, toggleMute, isMuted, isPlaying }}>
      {children}
    </MusicContext.Provider>
  );
}

function useMusic() {
  return useContext(MusicContext);
}

/* =========================================================
   WEBSITE CONTENT
========================================================= */

const navigation = [
  { label: "Home", path: "/" },
  { label: "Characters", path: "/characters" },
  { label: "Khansaar", path: "/khansaar" },
  { label: "Story", path: "/story" },
  { label: "Clans", path: "/clans" },
  { label: "Power", path: "/power" },
  { label: "Gallery", path: "/gallery" },
  { label: "Part 2", path: "/part-2" }
];

const characters = [
  {
    name: "Devaratha Raisaar",
    short: "DEVA",
    actor: "Prabhas",
    role: "The central protagonist",
    image: "characters/main/deva.jpg",
    description:
      "Deva is a formidable and fiercely loyal figure whose past is deeply connected to Varadha and the kingdom of Khansaar.",
    origin: "His complete birthplace and early history are not fully established.",
    belonging: "Raisaar family",
    status: "Central protagonist"
  },
  {
    name: "Varadharaja Mannar",
    short: "VARADHA",
    actor: "Prithviraj Sukumaran",
    role: "Prince and heir of the Mannar family",
    image: "characters/main/varadha.jpg",
    description:
      "Varadha is the son of Raja Mannar. His friendship with Deva and his struggle for power are central to the story.",
    origin: "Khansaar",
    belonging: "Mannar family",
    status: "Mannar heir"
  },
  {
    name: "Aadhya Krishnakanth",
    short: "AADHYA",
    actor: "Shruti Haasan",
    role: "A key figure connected to Deva's story",
    image: "characters/main/aadya.jpg",
    description:
      "Aadhya becomes connected to Deva during the events that bring the past and present together.",
    origin: "Her complete birthplace is not specified.",
    belonging: "Krishnakanth family",
    status: "Important supporting character"
  },
  {
    name: "Raja Mannar",
    short: "RAJA MANNAR",
    actor: "Jagapathi Babu",
    role: "Ruler of Khansaar",
    image: "characters/main/raja-mannar.jpg",
    description:
      "Raja Mannar is the powerful ruler of Khansaar and the father of Varadha.",
    origin: "Khansaar",
    belonging: "Mannar family",
    status: "Ruler"
  },
  {
    name: "Radha Rama",
    short: "RADHA RAMA",
    actor: "Sriya Reddy",
    role: "A powerful member of the royal family",
    image: "characters/mannar-family/radha-rama.jpg",
    description:
      "Radha Rama is an influential figure in Khansaar's political and royal world.",
    origin: "Khansaar",
    belonging: "Mannar royal family",
    status: "Royal family"
  },
  {
    name: "Deva's Mother",
    short: "DEVA'S MOTHER",
    actor: "Easwari Rao",
    role: "Deva's mother",
    image: "characters/main/deva-mother.jpg",
    description:
      "She plays an important role in Deva's upbringing and the choices that shape his life.",
    origin: "Not officially specified.",
    belonging: "Deva's family",
    status: "Family"
  }
];

const pageContent = {
  khansaar: {
    eyebrow: "THE FORBIDDEN KINGDOM",
    title: "KHANSAAR",
    description:
      "Khansaar is a secluded fortified kingdom governed through a royal house, powerful factions and three major tribes. Raja Mannar's rule and the succession struggle around Varadha place the kingdom at the centre of the film's conflict. Its political order is maintained through alliances, force and inherited authority.",
    image: "khansaar/khansaar-city.jpg"
  },
  story: {
    eyebrow: "A STORY OF FRIENDSHIP AND POWER",
    title: "THE STORY",
    description:
      "Salaar: Part 1 — Ceasefire centres on Deva and Varadha, childhood friends whose bond is tested when Varadha is drawn into the dangerous succession struggle in Khansaar. As rival powers move against him, Deva's past and promise to protect his friend become central to the conflict. The film ends with a major revelation about Deva's identity and the history between their worlds.",
    image: "story/story-bg-01.jpg"
  },
  clans: {
    eyebrow: "THE THREE TRIBES",
    title: "THE CLANS",
    description:
      "Khansaar's political order is shaped by three tribes: Mannaar, Shouryaanga and Ghaniyaar. Their leaders, loyalties and rivalries influence who can claim authority in the kingdom. The film presents the tribes as powerful social and political forces rather than ordinary family groups.",
    image: "clans/three-tribes.jpg"
  },
  power: {
    eyebrow: "THE KINGDOM'S HIERARCHY",
    title: "POWER",
    description:
      "Power in Khansaar is concentrated around the ruling Mannar family and the chiefs who command the kingdom's major factions. Raja Mannar's authority, Varadha's claim and the influence of the tribes create a tense balance. Control of the throne depends on political support as well as the strength to defend it.",
    image: "power/khansaar-army.jpg"
  }
};

/* =========================================================
   INTRO SCREEN
========================================================= */

function IntroScreen({ onEnter }) {
  return (
    <main className="intro-screen">
      <div
        className="intro-background"
        style={{
          backgroundImage: `url(${getImage("home/intro-bg.jpg")})`
        }}
      />

      <div className="intro-shade" />
      <div className="intro-grain" />

      <div className="intro-content">
        <img
          className="intro-seal"
          src={getImage("branding/salaar-seal.jpg")}
          alt=""
        />

        <p className="intro-overline">THE KINGDOM HAS A NEW DESTINY</p>

        <h1 className="intro-title">SALAAR</h1>

        <p className="intro-subtitle">PART 1 — CEASEFIRE</p>

        <div className="intro-line" />

        <p className="intro-tagline">
          SOME PROMISES ARE WRITTEN IN BLOOD.
        </p>

        <button className="enter-button" onClick={onEnter}>
          <span>ENTER KHANSAAR</span>
          <span className="enter-arrow">↗</span>
        </button>

        <p className="intro-footer">A KINGDOM. A FRIENDSHIP. A CEASEFIRE.</p>
      </div>
    </main>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <NavLink to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-symbol"><img src={getImage("branding/salaar-seal.jpg")} alt="Salaar seal" /></span>
        <span className="brand-name">SALAAR</span>
      </NavLink>

      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <nav className={`main-navigation ${menuOpen ? "menu-open" : ""}`}>
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={() => setMenuOpen(false)}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

/* =========================================================
   MUSIC CONTROL
========================================================= */

function MusicControl() {
  const { toggleMute, isMuted, isPlaying } = useMusic();

  return (
    <button
      className="music-control"
      onClick={toggleMute}
      aria-label={isMuted ? "Unmute music" : "Mute music"}
      title={isMuted ? "Unmute music" : "Mute music"}
    >
      <span className="music-icon">{isMuted ? "♪" : "♫"}</span>
      <span>{isMuted ? "SOUND OFF" : "SOUND ON"}</span>
      <span className={`music-indicator ${isPlaying && !isMuted ? "playing" : ""}`} />
    </button>
  );
}

/* =========================================================
   SHARED PAGE HERO
========================================================= */

function PageHero({ eyebrow, title, description, image, number }) {
  const imageUrl = getImage(image);

  return (
    <section className={`page-hero page-hero-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      {imageUrl && (
        <img className="page-hero-image" src={imageUrl} alt="" />
      )}

      <div className="page-hero-overlay" />

      <div className="page-hero-content">
        <p className="section-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-hero-description">{description}</p>
        <span className="page-number">{number}</span>
      </div>
    </section>
  );
}

/* =========================================================
   HOME PAGE
========================================================= */

function HomePage() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="home-hero">
        <img
          src={getImage("home/salaar-hero.jpg")}
          className="home-hero-image"
        />

        <div className="home-hero-overlay" />
        <img className="home-seal-watermark" src={getImage("branding/salaar-seal.jpg")} alt="" aria-hidden="true" />

        <div className="home-hero-content">
          <p className="section-eyebrow">WELCOME TO THE KINGDOM</p>
          <h1>THE WORLD OF SALAAR</h1>
          <p className="home-hero-text">
            Enter Khansaar: a fortified kingdom of rival tribes, royal ambition and shifting loyalties. At its centre are Deva and Varadha, whose childhood promise draws them into a struggle for the throne.
          </p>
          <button
            className="outline-button"
            onClick={() => navigate("/khansaar")}
          >
            DISCOVER KHANSAAR <span>↗</span>
          </button>
        </div>

        <span className="vertical-caption">SALAAR — CEASEFIRE</span>
      </section>

      <section className="home-introduction content-section">
        <div className="home-introduction-feature">
          <div>
            <p className="section-eyebrow">THE BEGINNING</p>
            <h2>A KINGDOM BUILT ON POWER.</h2>
          </div>
          <img
            className="home-introduction-image"
            src={getImage("home/khansaar-home.jpg")}
            alt="Khansaar, the fortified kingdom"
            loading="lazy"
          />
        </div>

        <p>
          Hidden beyond ordinary borders, Khansaar is a fortified world of royal strongholds, crowded settlements and powerful tribal territories. The Mannar family rules from its centre, while the chiefs and factions around them compete for influence. This is the kingdom whose future is shaken by the bond between Deva and Varadha.
        </p>
      </section>

      <section className="feature-grid">
        <FeatureCard
          title="THE PEOPLE"
          subtitle="Meet the characters"
          image="characters/main/deva.jpg"
          to="/characters"
        />
        <FeatureCard
          title="THE KINGDOM"
          subtitle="Explore Khansaar"
          image="khansaar/khansaar-city.jpg"
          to="/khansaar"
        />
        <FeatureCard
          title="THE TRIBES"
          subtitle="Discover the clans"
          image="clans/three-tribes.jpg"
          to="/clans"
        />
      </section>

      <section className="home-quote">
        <span>THE WORLD REMEMBERS</span>
        <h2>THE PROMISE.</h2>
        <p>THE FRIENDSHIP. THE CEASEFIRE.</p>
      </section>
    </main>
  );
}

function FeatureCard({ title, subtitle, image, to }) {
  const navigate = useNavigate();
  const imageUrl = getImage(image);

  return (
    <button className="feature-card" onClick={() => navigate(to)}>
      {imageUrl && <img src={imageUrl} alt="" />}
      <span className="feature-card-overlay" />
      <span className="feature-card-text">
        <small>{subtitle}</small>
        <strong>{title}</strong>
        <span>EXPLORE ↗</span>
      </span>
    </button>
  );
}

/* =========================================================
   CHARACTERS PAGE
========================================================= */

const characterImageGroups = [
  { title: "MAIN CHARACTERS", folder: "characters/main", eyebrow: "THE CENTRAL FIGURES" },
  { title: "MANNAR FAMILY", folder: "characters/mannar-family", eyebrow: "THE ROYAL FAMILY" },
  { title: "YOUNGER CHARACTERS", folder: "characters/younger", eyebrow: "THEIR EARLIER YEARS" },
  { title: "KHANSAAR CHARACTERS", folder: "characters/khansaar", eyebrow: "THE PEOPLE OF KHANSAAR" }
];

function readableImageName(path) {
  return path.split("/").pop()
    .replace(/\.(jpg|jpeg|png|webp)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const characterDescriptions = {
  "deva.jpg": "Deva, played by Prabhas, is the film's central fighter and Varadha's fiercely loyal childhood friend. He has lived away from Khansaar with his mother, but returns to protect Varadha when the struggle for succession threatens him. The ending reveals a deeper connection between Deva and the Shouryaanga tribe.",
  "varadha.jpg": "Varadha, played by Prithviraj Sukumaran, is Raja Mannar's son and a member of Khansaar's ruling family. After his father's political decisions put him in danger, he seeks Deva's help. His claim to power drives the central conflict of Ceasefire.",
  "aadya.jpg": "Aadhya, played by Shruti Haasan, becomes caught up in the conflict surrounding Deva and Khansaar. Her journey brings her into contact with Deva's hidden past and the dangerous world he has tried to leave behind.",
  "raja-mannar.jpg": "Raja Mannar, played by Jagapathi Babu, is the ruler of Khansaar and Varadha's father. His decisions over succession and the kingdom's power structure set the political conflict in motion.",
  "radha-rama.jpg": "Radha Rama, played by Sriya Reddy, is a powerful member of Khansaar's ruling circle. She takes an active part in the political manoeuvring surrounding the Mannar family and the question of who will control the kingdom.",
  "rudra.jpg": "Rudra belongs to the Mannar family circle. The film does not establish enough separate biographical detail here to add further claims.",
  "baachi.jpg": "Baachi is associated with the people surrounding Khansaar's ruling factions. The film gives limited independent background beyond that connection.",
  "young-deva.jpg": "Young Deva represents Deva's childhood, when his bond with Varadha is formed. Their early friendship becomes the promise that later draws Deva back into Khansaar's conflict.",
  "young-varadha.jpg": "Young Varadha shows the prince before the kingdom's succession struggle divides his world. His childhood connection with Deva is the foundation of their lasting loyalty.",
  "young-rudra.jpg": "This image depicts Rudra at a younger age within the Mannar family story. The film provides limited separate detail about his childhood.",
  "gaikwad.jpg": "Gaikwad is one of the named figures connected to Khansaar's network of power and factional politics. His place in the archive reflects the kingdom's wider circle beyond the central Mannar family.",
  "ranga.jpg": "Ranga is one of the figures in Khansaar's wider political and factional world. The film does not establish enough independent background to assign him a more specific biography.",
  "om.jpg": "Om is among the named people associated with Khansaar. His character belongs to the kingdom's wider network of factions and authority; further personal history is not clearly established in the film.",
  "vaali.jpg": "Vaali is one of the named characters in the Khansaar world. The film gives limited independent background, so this profile avoids attributing unconfirmed actions or relationships.",
  "bilal.jpg": "Bilal is connected to Deva's circle and the events surrounding Khansaar. His place in the story helps show the network of people around the central characters.",
  "krishnakanth.jpg": "Krishnakanth is connected to Aadhya's family and forms part of the supporting characters around the central conflict. The film gives limited additional personal history.",
  "obulamma.jpg": "Obulamma, played by Jhansi, is Radha Rama's maid and a trusted attendant within her household. She is drawn into the events surrounding Aadhya and the political manoeuvring in Khansaar.",
  "bhaarava.jpg": "Bhaarava, played by Bobby Simha, is one of Khansaar's Doras and a member of the Shouryaanga tribe. He is married to Radha Rama and is connected to the ruling Mannar family. His position shows how tribal identity and royal alliances overlap in Khansaar.",
  "narang.jpg": "Naarang, played by M. S. Chowdary, is one of Khansaar's Doras and belongs to the Ghaniyaar tribe. His family connections link him to Ranga and Gurung, placing him among the faction leaders who shape the kingdom's political balance.",
  "rinda.jpg": "Rinda, played by Ramana, is a loyal supporter of Varadha. He stands with Varadha during the struggle against the forces trying to undermine his position in Khansaar.",
  "vishnu.jpg": "Vishnu, played by Vajrang Shetty, is Naarang's son and part of the Ghaniyaar family network in Khansaar.",
  "cheeka.jpg": "Cheeka, played by Saurav Lokesh, is one of the Doras associated with the Ghaniyaar tribe. He is part of the group of powerful figures whose loyalties matter in Khansaar's political conflict.",
  "gurung.jpg": "Gurung, played by Cheluvaraj, is connected to Naarang and Ranga's family and belongs to the Ghaniyaar tribe. His place in the story reflects the influence of the kingdom's tribal leaders.",
  "hazare.jpg": "Hazare, played by Madhu Guruswamy, serves Rudra Raja Mannar. He is one of the men who support Rudra's side in the struggle within the Mannar family.",
  "pandit.jpg": "Pandit, played by Naveen Shankar, is one of Rudra's henchmen. He supports Rudra's faction during the power struggle in Khansaar.",
  "thiru.jpg": "Thiru, played by Shafi, is associated with Bhaarava as one of his men. His role connects him to the Shouryaanga side of Khansaar's factional world.",
  "vedha.jpg": "Vedha, played by Sampath Ram, is associated with Obulamma's side in the events around Aadhya. He is one of the supporting figures in the network of people operating around the royal household.",
  "chandram.jpg": "Chandram, played by Saptagiri, works as a school peon. His role belongs to the part of the story outside Khansaar's ruling circle.",
  "krishnakanth.jpg": "Krishnakanth, played by Ravi Bhat, is Aadhya's father and a businessman. His concern for his daughter draws him into the chain of events that brings Aadhya into Deva's life.",
  "gaikwad.jpg": "Gaikwad, also known as Baba and played by Tinnu Anand, is a trusted adviser and supporter of Varadha. He helps guide Varadha through the political dangers surrounding the Mannar succession.",
  "ranga.jpg": "Ranga, played by John Vijay, is one of Khansaar's Doras and belongs to the Ghaniyaar tribe. He is part of the network of faction leaders whose loyalties shape the balance of power.",
  "om.jpg": "Om, played by Devaraj, is one of the Doras of Khansaar and is connected to the Mannar family through marriage. He is among the influential figures in the kingdom's ruling circle.",
  "vaali.jpg": "Vaali, played by Brahmaji, is one of Khansaar's Doras and is associated with the Ghaniyaar tribe. His position makes him part of the council of powerful figures surrounding the kingdom's leadership.",
  "bilal.jpg": "Bilal, played by Mime Gopi, is a trusted associate who helps Varadha and is also connected to Deva. He helps Aadhya reach a place of safety, which brings her into contact with Deva.",
  "radha-rama.jpg": "Radha Rama, played by Sriya Reddy, is Raja Mannar's daughter and Rudra's sister. She is married to Bhaarava and is an influential figure in the royal family. She takes an active role in the power struggle and in protecting her family's interests.",
  "baachi.jpg": "Baachi Raja Mannar, played by Pramod Panju, is Varadha's younger brother and another son of Raja Mannar. He belongs to the younger branch of the Mannar family caught up in the kingdom's succession politics.",
  "rudra.jpg": "Rudra Raja Mannar, played by Ramachandra Raju, is Raja Mannar's son from his first marriage and Radha Rama's younger brother. He is one of the Doras and a rival power within the Mannar family, supported by his own men.",
  "young-rudra.jpg": "Young Rudra depicts Rudra Raja Mannar during his childhood in the royal family. The film gives less screen time to his early years than to the childhood friendship between Deva and Varadha."
};
function getCharacterDescription(path, name, groupTitle) {
  const fileName = path.split("/").pop().toLowerCase();
  return characterDescriptions[fileName] || `${name} is part of ${groupTitle.toLowerCase()}, the wider community surrounding Khansaar's royal family and factions. The film provides limited independently confirmed background for this character, so this profile does not invent a personal history or specific actions.`;
}

function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const detailRef = useRef(null);

  useEffect(() => {
    if (selectedCharacter) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }));
    }
  }, [selectedCharacter]);

  return (
    <main>
      <PageHero
        eyebrow="THE PEOPLE OF KHANSAAR"
        title="CHARACTERS"
        description="Explore the central figures, the Mannar family, younger characters and the people who shape the kingdom."
        image="characters/main/deva.jpg"
        number="01"
      />

      <section className="content-section characters-archive">
        {characterImageGroups.map((group) => {
          const groupImages = Object.entries(images).filter(([path]) =>
            path.toLowerCase().includes("/" + group.folder.toLowerCase() + "/")
          );

          return (
            <section className="character-archive-group" key={group.folder}>
              <div className="section-heading">
                <p className="section-eyebrow">{group.eyebrow}</p>
                <h2>{group.title}</h2>
              </div>

              {groupImages.length > 0 ? (
                <div className="character-archive-grid">
                  {groupImages.map(([path, url], index) => {
                    const name = readableImageName(path);
                    return (
                      <button
                        type="button"
                        className="character-archive-card"
                        key={path}
                        onClick={() => setSelectedCharacter({
                          title: name,
                          imageUrl: url,
                          imagePath: path,
                          group: group.title,
                          description: getCharacterDescription(path, name, group.title)
                        })}
                      >
                        <span className="character-archive-image">
                          <img src={url} alt={name} loading="lazy" />
                          <span className="character-index">{String(index + 1).padStart(2, "0")}</span>
                          
                        </span>
                        <span className="character-archive-name">{name}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="gallery-empty">No images found in <code>src/assets/{group.folder}/</code>. Check the folder and image filenames.</p>
              )}
            </section>
          );
        })}

        {selectedCharacter && (
          <section className="image-detail-panel character-detail-bottom" ref={detailRef} aria-live="polite">
            <div className="image-detail-copy">
              <p className="section-eyebrow">{selectedCharacter.group}</p>
              <h2>{selectedCharacter.title}</h2>
              <p>{selectedCharacter.description}</p>
              <button type="button" className="detail-close-button" onClick={() => setSelectedCharacter(null)}>CLOSE DETAILS ×</button>
            </div>
            <div className="image-detail-visual">
              <img src={selectedCharacter.imageUrl} alt={selectedCharacter.title} />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   KINGDOM / STORY / CLANS / POWER PAGES
========================================================= */

function InformationPage({ type, number }) {
  const page = pageContent[type];
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <main>
      <PageHero
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        image={page.image}
        number={number}
      />

      <section className="content-section information-section">
        {type !== "story" && type !== "power" && (
          <>
            <p className="section-eyebrow">EXPLORE THE WORLD</p>
            <h2>{page.title}</h2>
            <p className="information-description">{page.description}</p>
          </>
        )}

        {type === "khansaar" && (
          <div className="information-grid">
            <InfoTile title="THE CITY" image="khansaar/khansaar-city.jpg" onSelect={setSelectedImage} description="The heart of Khansaar and the setting for the kingdom’s political struggle." />
            <InfoTile title="THE ROYAL PALACE" image="khansaar/royal-palace.jpg" onSelect={setSelectedImage} description="The royal seat associated with Khansaar’s ruling family." />
            <InfoTile title="THE THRONE" image="khansaar/royal-throne.jpg" onSelect={setSelectedImage} description="A symbol of authority within the kingdom." />
            <InfoTile title="THE GATES" image="khansaar/khansaar-gates.jpg" onSelect={setSelectedImage} description="The imposing entrance to the hidden kingdom." />
            <InfoTile title="THE ASSEMBLY" image="khansaar/assembly-hall.jpg" onSelect={setSelectedImage} description="A place connected to Khansaar’s ruling factions and decisions." />
            <InfoTile title="THE STREETS" image="khansaar/khansaar-streets.jpg" onSelect={setSelectedImage} description="The lived-in streets and spaces of Khansaar." />
          </div>
        )}

        {type === "clans" && (
          <div className="tribe-panel">
            <button type="button" className="tribe-image-button" onClick={() => setSelectedImage({ title: "THE THREE TRIBES", image: "clans/three-tribes.jpg", description: "Mannaar, Shouryaanga and Ghaniyaar are the three tribes associated with Khansaar." })}>
              <img src={getImage("clans/three-tribes.jpg")} alt="The three tribes" />
              
            </button>
            <div>
              <h3>THE THREE TRIBES</h3>
              <p>Mannaar · Shouryaanga · Ghaniyaar</p>
              <p>
                The Mannaar, Shouryaanga and Ghaniyaar tribes form the foundation of Khansaar's political order. Their chiefs and loyalties influence the kingdom's balance of power, and the conflict around Varadha puts those relationships under pressure.
              </p>
            </div>
          </div>
        )}

        {type === "story" && (
          <section className="world-explore-panel story-world-panel">
            <img className="world-explore-background" src={getImage("story/story-bg-02.jpg")} alt="Deva and Varadha in Salaar: Part 1" />
            <div className="world-explore-shade" />
            <div className="world-explore-copy">
              <p className="section-eyebrow">EXPLORE THE WORLD</p>
              <h3>THE STORY</h3>
              <p>
                Bound by a promise made in childhood, Deva and Varadha are separated by time but brought together again by the struggle for Khansaar. When Varadha's place in the Mannar family puts him in danger, Deva returns to stand beside the friend who once stood by him. Their bond drives the heart of Salaar: Part 1 — Ceasefire, while the conflict reveals that Deva's past is far more deeply connected to Khansaar than it first appears.
              </p>
            </div>
          </section>
        )}

        {type === "power" && (
          <section className="world-explore-panel power-world-panel">
            <img className="world-explore-background" src={getImage("power/salaar.jpg")} alt="The power struggle in Salaar: Part 1" />
            <div className="world-explore-shade" />
            <div className="world-explore-copy">
              <p className="section-eyebrow">EXPLORE THE WORLD</p>
              <h3>POWER</h3>
              <p>
                Khansaar's power rests on more than a throne. Raja Mannar commands the kingdom, but the three tribes and rival faction leaders hold influence of their own. As Varadha is drawn into the succession battle, every alliance becomes important and every challenge threatens the kingdom's fragile order. Deva's return shifts that balance, turning a royal contest into a struggle that will decide who can command Khansaar.
              </p>
            </div>
          </section>
        )}

        {selectedImage && (
          <ImageDetailPanel
            title={selectedImage.title}
            eyebrow="KHANSAAR ARCHIVE"
            description={selectedImage.description}
            image={selectedImage.image}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </section>
    </main>
  );
}

function InfoTile({ title, image, onSelect, description }) {
  const imageUrl = getImage(image);
  return (
    <article className="info-tile">
      <button type="button" className="info-tile-image-button" onClick={() => onSelect?.({ title, image, description: description || title })}>
        {imageUrl ? <img src={imageUrl} alt={title} /> : <div className="image-placeholder">{title}</div>}
        
      </button>
      <h3>{title}</h3>
    </article>
  );
}

function ImageDetailPanel({ title, eyebrow, description, image, onClose }) {
  const panelRef = useRef(null);
  const imageUrl = getImage(image);

  useEffect(() => {
    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [title, image]);

  return (
    <section className="image-detail-panel" ref={panelRef} aria-live="polite">
      <div className="image-detail-copy">
        <p className="section-eyebrow">{eyebrow || "VISUAL ARCHIVE"}</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <button type="button" className="detail-close-button" onClick={onClose}>CLOSE DETAILS ×</button>
      </div>
      <div className="image-detail-visual">
        {imageUrl && <img src={imageUrl} alt={title} />}
      </div>
    </section>
  );
}

/* =========================================================
   GALLERY PAGE
========================================================= */

const galleryGroups = [
  { title: "POSTERS", folder: "gallery/posters" },
  { title: "DEVA", folder: "gallery/deva" },
  { title: "VARADHA", folder: "gallery/varadha" },
  { title: "KINGDOM OF KHANSAAR", folder: "gallery/kingdom" },
  { title: "BROTHERHOOD", folder: "gallery/brotherhood" },
  { title: "THREE TRIBES", folder: "gallery/three-tribes" }
];

const galleryMomentDescriptions = {
  "deva": {
    "deva": "Deva is introduced as a quiet, controlled man living with his mother away from Khansaar. When danger reaches Aadhya, his strength and protective instincts become impossible to conceal.",
    "young-deva": "This childhood moment belongs to the years when Deva and Varadha form the bond that shapes the entire story. Their promise survives the years and distance between them.",
    "salaar": "The image represents Deva's return to the conflict surrounding Khansaar. He does not seek the throne for himself; he comes because Varadha calls on the promise they made as children."
  },
  "varadha": {
    "varadha": "Varadha is caught between his place in the Mannar family and the danger created by the struggle for succession. His decision to call Deva brings their childhood bond back into the centre of Khansaar's politics.",
    "young-varadha": "As a boy, Varadha protects Deva and his mother when they are threatened. That act becomes the foundation of the promise Deva later honours.",
    "vardha": "This moment reflects Varadha's effort to secure his position in a kingdom where family ties, rival factions and political ambition constantly collide."
  },
  "brotherhood": {
    "deva-varadha": "A reminder of the friendship between Deva and Varadha. Their childhood promise is the reason Deva returns when Varadha's position in Khansaar is threatened.",
    "childhood": "The two boys build a bond before the kingdom's power struggle separates their paths. Varadha's protection of Deva and his mother becomes a promise that lasts into adulthood.",
    "young": "This frame belongs to the early years of Deva and Varadha's friendship, before the political conflict in Khansaar changes their lives.",
    "promise": "The promise between the friends is central to the film: Deva tells Varadha he will return whenever he is called, and years later he keeps that word.",
    "reunion": "Years after their separation, Deva and Varadha are brought together again by the threat to Varadha. Their reunion turns a personal promise into a force in Khansaar's succession conflict.",
    "together": "The image reflects the loyalty at the heart of Salaar. Although years and circumstances separate them, Deva's commitment to Varadha remains.",
    "friend": "Deva and Varadha's friendship began in childhood and survives the danger and political divisions of Khansaar. Their loyalty drives the central story."
  }
};

function getGalleryDescription(path, groupTitle, index) {
  const file = path.split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "").toLowerCase();
  const group = groupTitle.toLowerCase().includes("brotherhood") ? "brotherhood"
    : groupTitle.toLowerCase().includes("deva") ? "deva"
    : groupTitle.toLowerCase().includes("varadha") ? "varadha" : "";
  const known = galleryMomentDescriptions[group] || {};
  const match = Object.entries(known).find(([key]) => file.includes(key));
  if (match) return match[1];

  if (group === "deva") {
    return `This Deva frame belongs to his journey from a life kept quiet with his mother to the moment he is drawn back into Khansaar. His loyalty to Varadha and his instinct to protect those in danger define his role in the film. The exact action in this particular frame depends on the scene shown.`;
  }
  if (group === "varadha") {
    return `This Varadha frame reflects his position within the Mannar family and the succession struggle that threatens him. His childhood bond with Deva is the reason he reaches out for help. The exact action in this particular frame depends on the scene shown.`;
  }
  if (group === "brotherhood") {
    const moments = [
      "The friendship begins in childhood, when Varadha protects Deva and his mother. That act creates a bond that will later shape the fate of Khansaar.",
      "The boys' promise becomes the emotional foundation of the film. Deva's word to return whenever Varadha calls is not forgotten, even after years apart.",
      "Their paths diverge as Deva leaves Khansaar, but the connection between them remains. The kingdom's later crisis brings that friendship back into focus.",
      "When Varadha faces danger in the succession struggle, he calls on the one person whose loyalty he trusts. Deva answers that call.",
      "Deva's return changes the balance around Varadha. Their alliance is personal, rooted in childhood loyalty, but it has consequences for the kingdom.",
      "The film places their friendship against a world of shifting loyalties and family rivalries. This moment reflects why their bond matters to the story."
    ];
    return moments[index % moments.length];
  }
  return `This ${groupTitle.toLowerCase()} image is part of the film's visual record. It belongs to the world of Salaar: Part 1 – Ceasefire; the precise scene and action are not identifiable from the filename alone.`;
}

function GalleryPage() {
  const galleryImages = Object.entries(images);
  const [selectedImage, setSelectedImage] = useState(null);
  const galleryDetailRef = useRef(null);
  useEffect(() => {
    if (selectedImage) galleryDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [selectedImage]);

  return (
    <main>
      <PageHero
        eyebrow="FRAGMENTS OF A KINGDOM"
        title="THE GALLERY"
        description="A visual collection of the people, places and moments of Salaar."
        image="home/khansaar-home.jpg"
        number="06"
      />

      <section className="content-section">
        {galleryGroups.map((group) => {
          const matching = galleryImages.filter(([path]) =>
            path.toLowerCase().includes("/" + group.folder.toLowerCase() + "/")
          );

          return (
            <div className={`gallery-group gallery-group-${group.folder.split("/").pop()}`} key={group.title}>
              <div className="section-heading">
                <p className="section-eyebrow">VISUAL ARCHIVE</p>
                <h2>{group.title}</h2>
              </div>

              {matching.length > 0 ? (
                <>
                  {(["varadha", "kingdom", "three-tribes"].includes(group.folder.split("/").pop()) && matching.length > 0) && (
                    <button
                      type="button"
                      className="gallery-featured-image gallery-image-button"
                      onClick={() => setSelectedImage({ title: matching[0][0].split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/[-_]/g, " ").toUpperCase(), imagePath: matching[0][0], url: matching[0][1], group: group.title, description: getGalleryDescription(matching[0][0], group.title, 0) })}
                    >
                      <img src={matching[0][1]} alt={`${group.title} featured image`} loading="lazy" />
                    </button>
                  )}
                  <div className="gallery-grid">
                    {matching.map(([path, url], index) => {
                      if (["varadha", "kingdom", "three-tribes"].includes(group.folder.split("/").pop()) && index === 0) return null;
                      return (
                        <button
                          type="button"
                          className="gallery-image gallery-image-button"
                          key={path}
                          onClick={() => setSelectedImage({ title: path.split("/").pop().replace(/\.(jpg|jpeg|png|webp)$/i, "").replace(/[-_]/g, " ").toUpperCase(), imagePath: path, url, group: group.title, description: getGalleryDescription(path, group.title, index) })}
                        >
                          <img src={url} alt={`${group.title} image`} loading="lazy" />
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p className="gallery-empty">
                  Add your images to <code>src/assets/{group.folder}/</code>
                </p>
              )}
            </div>
          );
        })}
        {selectedImage && (
          <section className="image-detail-panel" id="gallery-image-details" ref={galleryDetailRef}>
            <div className="image-detail-copy">
              <p className="section-eyebrow">{selectedImage.group}</p>
              <h2>{selectedImage.title}</h2>
              <p>{selectedImage.description}</p>
              <button type="button" className="detail-close-button" onClick={() => setSelectedImage(null)}>CLOSE DETAILS ×</button>
            </div>
            <div className="image-detail-visual"><img src={selectedImage.url} alt={selectedImage.title} /></div>
          </section>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   PART 2 PAGE
========================================================= */

function PartTwoPage() {
  return (
    <main className="part-two-page">
      <div className="part-two-image">
        <img
          src={getImage("part-2/salaar-2-poster.jpg")}
          alt="Salaar Part 2 poster"
        />
      </div>

      <div className="part-two-overlay" />

      <div className="part-two-content">
        <p className="section-eyebrow">THE NEXT CHAPTER</p>
        <h1>SALAAR</h1>
        <h2>PART 2</h2>
        <p>
          The story of Khansaar is not over. The next chapter awaits.
          Official story details will be added when confirmed.
        </p>
        <span className="part-two-ending">PART 2 AWAITS</span>
      </div>
    </main>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">SALAAR</div>
      <p>PART 1 — CEASEFIRE</p>
      <span>THE KINGDOM NEVER FORGETS.</span>
    </footer>
  );
}

/* =========================================================
   WEBSITE LAYOUT
========================================================= */

function WebsiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="website">
      <Header />

      <Routes key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/characters" element={<CharactersPage />} />
        <Route
          path="/khansaar"
          element={<InformationPage type="khansaar" number="02" />}
        />
        <Route
          path="/story"
          element={<InformationPage type="story" number="03" />}
        />
        <Route
          path="/clans"
          element={<InformationPage type="clans" number="04" />}
        />
        <Route
          path="/power"
          element={<InformationPage type="power" number="05" />}
        />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/part-2" element={<PartTwoPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>

      <Footer />
      <MusicControl />
    </div>
  );
}

/* =========================================================
   ROOT APP
========================================================= */

function AppContent() {
  const [entered, setEntered] = useState(false);
  const [showSeal, setShowSeal] = useState(false);
  const { startMusic } = useMusic();

  const enterKhansaar = async () => {
    await startMusic();
    setEntered(true);
    setShowSeal(true);
    window.setTimeout(() => setShowSeal(false), 3400);
  };

  if (!entered) {
    return <IntroScreen onEnter={enterKhansaar} />;
  }

  return (
    <>
      <WebsiteLayout />
      {showSeal && (
        <div className="seal-transition seal-transition-once" aria-hidden="true">
          <div className="seal-transition-crop">
            <img
              className="seal-transition-symbol"
              src={getImage("branding/salaar-seal.jpg")}
              alt=""
            />
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </MusicProvider>
  );
}
