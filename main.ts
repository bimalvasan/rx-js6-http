import { fromEvent, Observable } from "rxjs";
import { mergeMap, retry } from 'rxjs/operators';

let output = document.getElementById('output');
let button = document.getElementById('button');

let click = fromEvent(button, 'click');

function load(url) {
    return new Observable(observer => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete()
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open('GET', url);
        xhr.send();
    });
}

function render(movies) {
    movies.forEach(m => {
        let div = document.createElement('div');
        div.innerText = m.title;
        output.appendChild(div);
    });
}

//load("movie.json").subscribe(render)

click.pipe(mergeMap(e => load("movies.json")), retry(3))
    .subscribe(
        render,                                  //Next
        ex => console.error(`Error: ${ex}`),     //Error
        () => console.log('Complete!')           //Complete
    );