const ITEMS = [
  {name: 'عسل', img: 'images/honey.jpg', group: 'natural'},
  {name: 'نارگیل', img: 'images/coconut.jpg', group: 'natural'},
  {name: 'سیب', img: 'images/apple.jpg', group: 'natural'},
  {name: 'خرما', img: 'images/date.jpg', group: 'natural'},
  {name: 'کیک', img: 'images/cake.jpg', group: 'artificial'},
  {name: 'ابمیوه', img: 'images/juice.jpg', group: 'artificial'},
  {name: 'شکلات', img: 'images/chocolate.jpg', group: 'artificial'},
  {name: 'مربا', img: 'images/jam.jpg', group: 'artificial'}
];

let score = 0;
let totalItems = ITEMS.length;

function shuffle(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderItems(){
    const box = document.getElementById('items');
    box.innerHTML = '';
    let arr = [...ITEMS];
    shuffle(arr);
    arr.forEach(it => {
        const div = document.createElement('div');
        div.className = 'item';
        div.draggable = true;
        div.innerHTML = `<img src='${it.img}'><br>${it.name}`;
        div.setAttribute('data-group', it.group);

        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', it.name);
            const click = document.getElementById('clickSnd');
            if(click) click.play().catch(()=>{});
        });

        box.appendChild(div);
    });
}

function setupDrops(){
    document.querySelectorAll('.dropzone').forEach(zone => {
        zone.addEventListener('dragover', e => e.preventDefault());
        zone.addEventListener('drop', e => {
            e.preventDefault();
            const name = e.dataTransfer.getData('text/plain');
            const el = [...document.querySelectorAll('.item')].find(x => x.innerText.includes(name));
            if(!el) return;
            const expected = el.getAttribute('data-group');
            const target = zone.getAttribute('data-group');
            if(expected === target) {
                zone.appendChild(el);
                score++;
            } else {
                score--;
            }
            document.getElementById('score').textContent = 'امتیاز: ' + score;

            const click = document.getElementById('clickSnd');
            if(click) click.play().catch(()=>{});

            checkEndGame();
        });
    });
}

function checkEndGame(){
    const placedItems = document.querySelectorAll('.dropzone .item').length;
    if(placedItems === totalItems){
        setTimeout(()=>{
            alert('بازی تمام شد! امتیاز نهایی: ' + score + '/' + totalItems);
        }, 200);
    }
}

document.getElementById('playBtn').onclick = () => {
    score = 0;
    document.getElementById('score').textContent = 'امتیاز: 0';
    renderItems();
    setupDrops();
    const bg = document.getElementById('bgMusic');
    if(bg) bg.play().catch(()=>{});
};
