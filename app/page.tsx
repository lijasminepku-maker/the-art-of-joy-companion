"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";

type Chapter = {
  id: number;
  part: string;
  focus: string;
  background: string;
  read: string;
  bilingual: [string, string];
  analysis: string;
};

type StudyWord = { word: string; meaning: string; use: string };
type StudyKit = { words: StudyWord[]; technique: string; model: string; prompt: string };

const wordThemes: StudyKit[] = [
  { words: [{ word: "drag", meaning: "拖，费力地移动", use: "drag oneself through" }, { word: "splinter", meaning: "碎木片；裂开", use: "a splinter of light" }, { word: "hovel", meaning: "破旧小屋", use: "a cramped hovel" }, { word: "stifle", meaning: "压抑，窒息", use: "stifle a cry" }, { word: "linger", meaning: "徘徊；迟迟不散", use: "a smell lingered" }, { word: "bleak", meaning: "凄凉的，黯淡的", use: "a bleak room" }], technique: "用一个具体名词加一个感官动词，让环境先于解释说话。", model: "A damp smell lingered in the narrow room.", prompt: "找一处空间描写：它如何暗示人物的处境？" },
  { words: [{ word: "convent", meaning: "女修道院", use: "life in a convent" }, { word: "devotion", meaning: "虔诚；投入", use: "show devotion to" }, { word: "confess", meaning: "忏悔；坦白", use: "confess a fear" }, { word: "obedience", meaning: "服从", use: "demand obedience" }, { word: "mercy", meaning: "仁慈，宽恕", use: "ask for mercy" }, { word: "stern", meaning: "严厉的", use: "a stern voice" }], technique: "把抽象权力写进动作和语气，而不是直接说“他很有权力”。", model: "Her stern voice allowed no room for questions.", prompt: "谁能命令，谁只能沉默？用一个动词说明。" },
  { words: [{ word: "estate", meaning: "庄园；地产", use: "manage an estate" }, { word: "inherit", meaning: "继承", use: "inherit a name" }, { word: "privilege", meaning: "特权", use: "a privilege to" }, { word: "servant", meaning: "仆人", use: "a household servant" }, { word: "summon", meaning: "召唤；传唤", use: "summon someone" }, { word: "bargain", meaning: "交易；讨价还价", use: "strike a bargain" }], technique: "用身份词和房间/物品的归属，侧写阶级，而非直接下结论。", model: "The keys were not merely metal; they decided who could enter.", prompt: "本章中哪件物品或哪个空间最能说明权力？" },
  { words: [{ word: "enlist", meaning: "参军；争取支持", use: "enlist in the army" }, { word: "ration", meaning: "配给；限量", use: "food rationing" }, { word: "upheaval", meaning: "剧变，动荡", use: "social upheaval" }, { word: "scarce", meaning: "稀缺的", use: "become scarce" }, { word: "endure", meaning: "忍受；持续", use: "endure hardship" }, { word: "aftermath", meaning: "余波，后果", use: "in the aftermath of" }], technique: "用小的日常变化呈现大的历史，而不急于讲大道理。", model: "After the news arrived, even bread became a measure of fear.", prompt: "历史事件怎样改变了一个日常细节？" },
  { words: [{ word: "tenderness", meaning: "温柔，柔情", use: "show tenderness" }, { word: "jealous", meaning: "嫉妒的", use: "be jealous of" }, { word: "longing", meaning: "渴望，思念", use: "a longing for" }, { word: "vow", meaning: "誓言", use: "make a vow" }, { word: "conceal", meaning: "隐瞒，掩藏", use: "conceal the truth" }, { word: "burden", meaning: "负担", use: "carry a burden" }], technique: "把情绪落在身体、停顿或具体物件上，避免只写 happy / sad。", model: "She folded the letter twice before she answered.", prompt: "人物没有直说的情绪，藏在什么动作或沉默里？" },
  { words: [{ word: "regime", meaning: "政权，统治体制", use: "an authoritarian regime" }, { word: "dissent", meaning: "异议", use: "voice dissent" }, { word: "allegiance", meaning: "忠诚，拥护", use: "pledge allegiance" }, { word: "propaganda", meaning: "宣传", use: "state propaganda" }, { word: "refuge", meaning: "避难处；庇护", use: "seek refuge" }, { word: "defy", meaning: "违抗，挑战", use: "defy an order" }], technique: "先辨说话者和风险，再理解政治词；公开语言与私人信念未必相同。", model: "He lowered his voice before he named the regime.", prompt: "这句话是谁说的？他/她为何不能直接说？" },
  { words: [{ word: "custody", meaning: "拘押；监护权", use: "taken into custody" }, { word: "resistance", meaning: "抵抗；抵抗运动", use: "join the resistance" }, { word: "liberation", meaning: "解放", use: "after liberation" }, { word: "scarcity", meaning: "匮乏", use: "a time of scarcity" }, { word: "witness", meaning: "见证者；目睹", use: "bear witness to" }, { word: "trauma", meaning: "创伤", use: "live with trauma" }], technique: "克制地写创伤：以可观察的后果替代夸张形容词。", model: "He answered slowly, as if each word had to cross a distance.", prompt: "本章的沉默或停顿可能意味着什么？" },
  { words: [{ word: "rebuild", meaning: "重建", use: "rebuild a life" }, { word: "disillusionment", meaning: "幻灭", use: "political disillusionment" }, { word: "compromise", meaning: "妥协", use: "reach a compromise" }, { word: "solidarity", meaning: "团结", use: "act in solidarity" }, { word: "legacy", meaning: "遗产；留下的影响", use: "leave a legacy" }, { word: "reconcile", meaning: "和解；调和", use: "reconcile with" }], technique: "用对比组织复杂评价：not only ... but also ... / while ... , ...。", model: "Freedom brought relief, but it did not erase what had been lost.", prompt: "本章的“自由”带来了什么，又没有解决什么？" },
];

const studyFor = (id: number): StudyKit => {
  const themeIndex = id <= 4 ? 0 : id <= 18 ? 1 : id <= 29 ? 2 : id <= 39 ? 3 : id <= 57 ? 4 : id <= 74 ? 5 : id <= 84 ? 6 : 7;
  const theme = wordThemes[themeIndex];
  const start = (id - 1) % theme.words.length;
  return { ...theme, words: Array.from({ length: 5 }, (_, index) => theme.words[(start + index) % theme.words.length]) };
};

const partFor = (id: number) =>
  id <= 39 ? "Part One" : id <= 57 ? "Part Two" : id <= 74 ? "Part Three" : "Part Four";

const details = (id: number): Omit<Chapter, "id" | "part"> => {
  if (id <= 4) return {
    focus: "西西里乡村与童年", background: "1900 年前后的西西里：贫困、佃农关系与父权家庭塑造了一个孩子可拥有的选择。注意身体与劳动描写如何提示阶级位置。", read: "在本页的本地阅读器或你习惯的 EPUB 阅读器中完成 Chapter " + id + "。先连续读，不逐词翻译；只标记妨碍理解、反复出现或很有表达力的词块。", bilingual: ["Class is shown through work, space, and who gets to speak.", "阶级通过劳动、空间，以及谁有资格发言来呈现。"], analysis: "从具体的家庭和空间关系入手：谁拥有资源，谁只能承受后果？"
  };
  if (id <= 18) return {
    focus: "修道院、教育与规训", background: "convent 不只是宗教场所，也是教育、慈善和纪律机构。理解称谓（nun、Mother、priest）背后的等级，比记住全部宗教词更重要。", read: "完成 Chapter " + id + "，并收藏 6–10 个词块。优先选与权威、服从、身体或空间有关的表达。", bilingual: ["Care and control can exist in the same institution.", "照护与控制可以存在于同一个制度中。"], analysis: "观察善意、保护与限制是否同时出现；不要急着把人物简化为好人或坏人。"
  };
  if (id <= 29) return {
    focus: "庄园、贵族与社会流动", background: "estate、title、inheritance 和 marriage 构成贵族权力的语言。西西里的土地租佃链也让佣人、管理者和地主之间的关系很复杂。", read: "完成 Chapter " + id + "。阅读后在词汇本记下一个“身份词”、一个“财产词”和一个“关系动词”。", bilingual: ["A title can carry power, duty, and constraint at once.", "一个头衔可以同时携带权力、义务与束缚。"], analysis: "本章可从“私人关系是否也被财产和家名塑造”这一问题进入。"
  };
  if (id <= 39) return {
    focus: "战争前夕与家族秩序", background: "1915 年意大利参加第一次世界大战。乡村生活与国家大事并不同步，但战争、价格、劳动力和家族荣誉会逐步进入私人生活。", read: "完成 Chapter " + id + "。遇到长句时圈出主语、核心动词和转折词，再看修饰语。", bilingual: ["History enters private life through small changes in power and language.", "历史通过权力与语言中的细小变化进入私人生活。"], analysis: "留意时间推进：社会变化如何改变人物原以为固定的规则？"
  };
  if (id <= 57) return {
    focus: "成年、亲密关系与后果", background: "1920 年代的婚姻、继承、名誉与母职仍强烈约束女性。注意 diary、rumour、memory 等信息来源：叙述不总是完全可靠。", read: "完成 Chapter " + id + "。只把真正想再次使用的表达加入词汇卡，并用一句自己的英文造句。", bilingual: ["A choice can be personal and still be shaped by social rules.", "一个选择可以是个人的，同时仍被社会规则塑造。"], analysis: "将人物的选择与其可得到的资源分开看：她真正拥有多少选择？"
  };
  if (id <= 74) return {
    focus: "法西斯时期与新的思想", background: "1922 年后法西斯逐步建立一党统治。自由主义、社会主义、无政府主义与共产主义并存，角色的公开用语可能与私人立场不同。", read: "完成 Chapter " + id + "。标记一个政治词、一个情绪词和一个连接词（however / therefore / although 等）。", bilingual: ["Public language and private belief are not always the same.", "公开语言与私人信念并不总是一致。"], analysis: "先问“谁在说、对谁说、在什么风险下说”，再判断政治观点。"
  };
  if (id <= 84) return {
    focus: "战争、流离与国家权力", background: "二战时期，旅行、艺术教育、家庭和生育都受不稳定环境影响。法西斯国家的监控、逮捕与监禁会改变人们说话和沉默的方式。", read: "完成 Chapter " + id + "。若内容令人不适，可只写一条中性事实摘要，并停止精读细节。", bilingual: ["Silence can be a response to fear, grief, or power.", "沉默可以是对恐惧、悲伤或权力的回应。"], analysis: "观察宏大政治如何通过家庭、身体和日常对话被感受到。"
  };
  return {
    focus: "解放后、政治与记忆", background: "1943 年政权垮台、1945 年解放后，重建并不等于问题消失。战后左翼政党、工会、家庭代际冲突与政治幻灭共同构成新的环境。", read: "完成 Chapter " + id + "。今天写 60–100 词英文日志：What changed, and why does it matter?", bilingual: ["Liberation is a process, not a single finished moment.", "解放是一个过程，而不是一个瞬间完成的事件。"], analysis: "将自由、快乐、权力和历史放在一起思考；结尾尤其适合回看全书早期的选择。"
  };
};

const chapters: Chapter[] = Array.from({ length: 95 }, (_, index) => {
  const id = index + 1;
  return { id, part: partFor(id), ...details(id) };
});

export default function Home() {
  const [chapterId, setChapterId] = useState(1);
  const [complete, setComplete] = useState<number[]>([]);
  const [showAfter, setShowAfter] = useState(false);
  const [word, setWord] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState("");
  const [bookName, setBookName] = useState("");
  const [readerMessage, setReaderMessage] = useState("选择你手机中已保存的 EPUB 后，即可在此阅读。文件不会上传。 ");
  const readerRef = useRef<HTMLDivElement>(null);
  const readerInputRef = useRef<HTMLInputElement>(null);
  const renditionRef = useRef<{ destroy?: () => void } | null>(null);

  useEffect(() => {
    const savedComplete = localStorage.getItem("joy-complete");
    const savedWords = localStorage.getItem("joy-words");
    const savedCheckIn = localStorage.getItem("joy-last-check-in");
    if (savedComplete) setComplete(JSON.parse(savedComplete));
    if (savedWords) setWords(JSON.parse(savedWords));
    if (savedCheckIn) setLastCheckIn(savedCheckIn);
  }, []);

  const chapter = useMemo(() => chapters.find((item) => item.id === chapterId)!, [chapterId]);
  const progress = Math.round((complete.length / 95) * 100);
  const isComplete = complete.includes(chapterId);
  const study = studyFor(chapterId);

  function toggleComplete() {
    const next = isComplete ? complete.filter((id) => id !== chapterId) : [...complete, chapterId];
    setComplete(next);
    localStorage.setItem("joy-complete", JSON.stringify(next));
    setShowAfter(!isComplete);
  }

  function addWord() {
    const value = word.trim();
    if (!value || words.includes(value)) return;
    const next = [...words, value];
    setWords(next);
    localStorage.setItem("joy-words", JSON.stringify(next));
    setWord("");
  }

  function saveToday() {
    const today = new Intl.DateTimeFormat("en-CA").format(new Date());
    localStorage.setItem("joy-last-check-in", today);
    localStorage.setItem("joy-last-chapter", String(chapterId));
    setLastCheckIn(today);
  }

  async function openEpub(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".epub")) {
      setReaderMessage("请选择 EPUB 格式的电子书文件。");
      return;
    }
    if (!readerRef.current) return;
    setReaderMessage("正在这台设备上打开电子书…");
    renditionRef.current?.destroy?.();
    readerRef.current.replaceChildren();
    try {
      const { default: ePub } = await import("epubjs");
      const book = ePub(await file.arrayBuffer());
      const rendition = book.renderTo(readerRef.current, { width: "100%", height: "620px", flow: "scrolled-doc" });
      renditionRef.current = rendition;
      await rendition.display();
      setBookName(file.name.replace(/\.epub$/i, ""));
      setReaderMessage("正在本机阅读：不上传、不保存到网站服务器。");
    } catch {
      setBookName("");
      setReaderMessage("这个文件暂时无法打开。请确认它是可读取的 EPUB 文件后重试。");
    }
  }

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="dot" />JOY / READING</div>
        <div className="progress-label">{complete.length}/95 · {progress}%</div>
      </header>

      <section className="hero">
        <p className="eyebrow">THE ART OF JOY · PENGUIN MODERN CLASSICS</p>
        <h1>今天，读得深一点。</h1>
        <p className="lede">按兴趣决定今天读多少。读一页、半章或整章都可以；这里负责把每一次阅读变成真实可积累的英语能力。</p>
      </section>

      <section className="reader-import" aria-label="本地 EPUB 阅读器">
        <div>
          <p className="eyebrow">YOUR PRIVATE READER</p>
          <h2>把你的 EPUB 放在这里读。</h2>
          <p>文件只在你的手机浏览器里打开，不会传到网站，也不会被公开。</p>
        </div>
        <label className="import-button">
          选择本地 EPUB
          <input ref={readerInputRef} type="file" accept="application/epub+zip,.epub" onChange={openEpub} />
        </label>
        <p className="reader-message">{bookName ? `已打开：${bookName}。` : readerMessage}</p>
        <div ref={readerRef} className={bookName ? "epub-canvas open" : "epub-canvas"} />
      </section>

      <section className="chapter-picker" aria-label="选择章节">
        <button onClick={() => setChapterId(Math.max(1, chapterId - 1))} disabled={chapterId === 1} aria-label="上一章">←</button>
        <label>
          <span>今日章节</span>
          <select value={chapterId} onChange={(event) => { setChapterId(Number(event.target.value)); setShowAfter(complete.includes(Number(event.target.value))); }}>
            {chapters.map((item) => <option key={item.id} value={item.id}>Chapter {item.id} · {item.part}</option>)}
          </select>
        </label>
        <button onClick={() => setChapterId(Math.min(95, chapterId + 1))} disabled={chapterId === 95} aria-label="下一章">→</button>
      </section>

      <section className="today-card">
        <div className="card-kicker">SELF-PACED · {chapter.part.toUpperCase()}</div>
        <h2>Chapter {chapter.id}<span>{chapter.focus}</span></h2>
        <div className="rule" />
        <h3>开始前 · 必需背景</h3>
        <p>{chapter.background}</p>
        <section className="study-kit">
          <h3>IELTS 5 · 本章必学词块</h3>
          <p className="study-intro">今天只学这 5 个；先在阅读中认出它们，再尝试使用其中 1 个。</p>
          <div className="vocabulary-grid">
            {study.words.map((item) => <article key={item.word}><b>{item.word}</b><span>{item.meaning}</span><em>{item.use}</em></article>)}
          </div>
          <div className="sentence-lab">
            <h3>好句写法 · 可迁移</h3>
            <p>{study.technique}</p>
            <p className="english">{study.model}</p>
            <small>阅读提示：{study.prompt}</small>
          </div>
        </section>
        <div className="read-task">
          <div><span className="task-no">01</span><strong>在本地 EPUB 阅读器中阅读</strong><p>{chapter.read}</p></div>
          <button className="books-link" onClick={() => readerInputRef.current?.click()}>选择 EPUB ↗</button>
        </div>
        <button className="pause" onClick={saveToday}>{lastCheckIn === new Intl.DateTimeFormat("en-CA").format(new Date()) ? "今天已留下阅读位置" : "今天先读到这里"}</button>
        <button className={isComplete ? "complete done" : "complete"} onClick={toggleComplete}>
          {isComplete ? "已完成 · 查看阅读后内容" : "完成今日阅读"}
        </button>
      </section>

      {showAfter && (
        <section className="after-reading">
          <p className="eyebrow">AFTER READING</p>
          <h2>收束今天的阅读</h2>
          <div className="after-grid">
            <article>
              <h3>双语要点</h3>
              <p className="english">{chapter.bilingual[0]}</p>
              <p>{chapter.bilingual[1]}</p>
              <small>这是学习提示，不是本章全文翻译。</small>
            </article>
            <article>
              <h3>章节结束 · 赏析</h3>
              <p>{chapter.analysis}</p>
              <small>风格追问：{study.prompt}</small>
            </article>
          </div>
          <div className="word-box">
            <h3>标记一个词或词块</h3>
            <p>阅读时遇到想复习的表达，就记在这里。它会保存在这台设备。</p>
            <div className="word-entry">
              <input value={word} onChange={(event) => setWord(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWord()} placeholder="例如: come to terms with" aria-label="添加词汇" />
              <button onClick={addWord}>加入</button>
            </div>
            {words.length > 0 && <div className="word-list">{words.slice(-8).map((item) => <span key={item}>{item}</span>)}</div>}
          </div>
        </section>
      )}

      <section className="roadmap">
        <div><p className="eyebrow">READING MAP</p><h2>不用赶进度。</h2></div>
        <div className="part-list">
          <p><b>01</b> Chapters 1–39 <span>童年、修道院、庄园与战争前夜</span></p>
          <p><b>02</b> Chapters 40–57 <span>成年、亲密关系与后果</span></p>
          <p><b>03</b> Chapters 58–74 <span>法西斯时期与新思想</span></p>
          <p><b>04</b> Chapters 75–95 <span>战争、解放与记忆</span></p>
        </div>
      </section>

    </main>
  );
}
