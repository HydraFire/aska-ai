// Вывод текста с розпознаного звука на экран
class displayWordsClass {
  constructor() {
    this.wordsTag = document.querySelector('.words');
  }
  displayMicrophone() {
    const p = document.createElement('p');
    p.style.color = 'rgba(50, 50, 50, 0.9)';
    p.style.lineHeight = '3.5rem';
    p.style.fontSize = '30px';
    p.textContent = '🎤';
    this.wordsTag.appendChild(p);
  }
  displayWords(text) {
    this.wordsTag.firstChild.textContent = text;
  }
  displayWordsStabilize() {
    if (this.wordsTag.children[1]) {
      this.wordsTag.children[1].style.lineHeight = '2rem';
      this.wordsTag.children[1].style.color = 'rgba(50, 50, 50, 0.7)';
      this.wordsTag.children[1].style.fontSize = '24px';
    }
    if (this.wordsTag.children[2]) {
      this.wordsTag.children[2].style.color = 'rgba(50, 50, 50, 0.5)';
      this.wordsTag.children[2].style.fontSize = '20px';
    }
    if (this.wordsTag.children[3]) {
      this.wordsTag.children[3].style.color = 'rgba(50, 50, 50, 0.35)';
      this.wordsTag.children[3].style.fontSize = '18px';
    }
    if (this.wordsTag.children[4]) {
      this.wordsTag.children[4].style.color = 'rgba(50, 50, 50, 0.2)';
      this.wordsTag.children[4].style.fontSize = '14px';
    }
    if (this.wordsTag.children.length > 5) {
      this.wordsTag.removeChild(this.wordsTag.lastChild);
    }
  }
  displayWordsFinal(text) {
    const p = document.createElement('p');
    p.textContent = text;
    p.style.fontSize = '30px';
    p.style.color = 'rgba(50, 50, 50, 0.9)';
    p.style.lineHeight = '3.5rem';
    this.wordsTag.insertBefore(p, this.wordsTag.children[0]);
    this.displayWordsStabilize();
  }
  getWordsByNum(num) {
    if (this.wordsTag.children[num]) {
      return this.wordsTag.children[num].textContent;
    }
    return false;
  }
}

export default displayWordsClass;
