"use client";

import { useEffect, useMemo, useState } from "react";

type Chapter = {
  id: number;
  part: string;
  focus: string;
  background: string;
  read: string;
  bilingual: [string, string];
  analysis: string;
};

const partFor = (id: number) =>
  id <= 39 ? "Part One" : id <= 57 ? "Part Two" : id <= 74 ? "Part Three" : "Part Four";

const details = (id: number): Omit<Chapter, "id" | "part"> => {
  if (id <= 4) return {
    focus: "西西里乡村与童年", background: "1900 年前后的西西里：贫困、佃农关系与父权家庭塑造了一个孩子可拥有的选择。注意身体与劳动描写如何提示阶级位置。", read: "在 Apple Books 中完成 Chapter " + id + "。先连续读，不逐词翻译；只标记妨碍理解、反复出现或很有表达力的词块。", bilingual: ["Class is shown through work, space, and who gets to speak.", "阶级通过劳动、空间，以及谁有资格发言来呈现。"], analysis: "从具体的家庭和空间关系入手：谁拥有资源，谁只能承受后果？"
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

const weekFor = (chapter: number) => Math.min(40, Math.ceil(chapter / 2.4));

export default function Home() {
  const [chapterId, setChapterId] = useState(1);
  const [complete, setComplete] = useState<number[]>([]);
  const [showAfter, setShowAfter] = useState(false);
  const [word, setWord] = useState("");
  const [words, setWords] = useState<string[]>([]);

  useEffect(() => {
    const savedComplete = localStorage.getItem("joy-complete");
    const savedWords = localStorage.getItem("joy-words");
    if (savedComplete) setComplete(JSON.parse(savedComplete));
    if (savedWords) setWords(JSON.parse(savedWords));
  }, []);

  const chapter = useMemo(() => chapters.find((item) => item.id === chapterId)!, [chapterId]);
  const progress = Math.round((complete.length / 95) * 100);
  const isComplete = complete.includes(chapterId);

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

  return (
    <main>
      <header className="topbar">
        <div className="brand"><span className="dot" />JOY / READING</div>
        <div className="progress-label">{complete.length}/95 · {progress}%</div>
      </header>

      <section className="hero">
        <p className="eyebrow">THE ART OF JOY · PENGUIN MODERN CLASSICS</p>
        <h1>今天，读得深一点。</h1>
        <p className="lede">一个轻量的英语阅读空间。背景先行，正文留在你的手机 EPUB 阅读器，读完再回到这里收集语言与想法。</p>
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
        <div className="card-kicker">WEEK {weekFor(chapter.id)} · {chapter.part.toUpperCase()}</div>
        <h2>Chapter {chapter.id}<span>{chapter.focus}</span></h2>
        <div className="rule" />
        <h3>开始前 · 必需背景</h3>
        <p>{chapter.background}</p>
        <div className="read-task">
          <div><span className="task-no">01</span><strong>在你的 EPUB 阅读器中阅读</strong><p>{chapter.read}</p></div>
          <a className="books-link" href="#reader-tip">手机阅读提示 ↓</a>
        </div>
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
              <h3>简略章节解析</h3>
              <p>{chapter.analysis}</p>
              <small>写作提示：用 60–100 词回答 “What changed, and why?”</small>
            </article>
          </div>
          <div className="word-box">
            <h3>标记一个词或词块</h3>
            <p>在 Books 里划线后，把真正想复习的表达记在这里。它会保存在这台设备。</p>
            <div className="word-entry">
              <input value={word} onChange={(event) => setWord(event.target.value)} onKeyDown={(event) => event.key === "Enter" && addWord()} placeholder="例如: come to terms with" aria-label="添加词汇" />
              <button onClick={addWord}>加入</button>
            </div>
            {words.length > 0 && <div className="word-list">{words.slice(-8).map((item) => <span key={item}>{item}</span>)}</div>}
          </div>
        </section>
      )}

      <section className="roadmap">
        <div><p className="eyebrow">READING MAP</p><h2>40 周，不赶进度。</h2></div>
        <div className="part-list">
          <p><b>01</b> Chapters 1–39 <span>童年、修道院、庄园与战争前夜</span></p>
          <p><b>02</b> Chapters 40–57 <span>成年、亲密关系与后果</span></p>
          <p><b>03</b> Chapters 58–74 <span>法西斯时期与新思想</span></p>
          <p><b>04</b> Chapters 75–95 <span>战争、解放与记忆</span></p>
        </div>
      </section>

      <section className="reader-tip" id="reader-tip">
        <p className="eyebrow">PHONE SETUP</p>
        <h2>Android 也可以轻松读。</h2>
        <p>把你合法获得的 EPUB 文件发到手机，然后用你习惯的 EPUB 阅读器打开即可。阅读正文不在本网站展示；这个网页负责每天的背景、进度、词汇和读后回收。</p>
        <p>每台设备的打卡与词汇独立保存在该设备浏览器中，不需要连接 ChatGPT。</p>
      </section>
    </main>
  );
}
