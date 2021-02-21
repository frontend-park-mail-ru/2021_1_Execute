const root = document.getElementById('root');

const testItem = document.createElement('div');
testItem.classList.add('menu-box');

const testItemH1 = document.createElement('h1');
testItemH1.innerText = 'Тест';

testItem.append(testItemH1);
testItem.append(testItemH1.cloneNode());
testItem.append(testItemH1.cloneNode(true));

root.append(testItem);
