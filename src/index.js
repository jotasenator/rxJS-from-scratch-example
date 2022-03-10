
const root = document.getElementById('app');

root.innerHTML=`
    <h1>Hola RxJS</h1>
    <button id='btn'>click here</button>

`;

const btn = document.getElementById('btn')

// btn.addEventListener('click',callback=(e)=>{
//     console.log(e)
//     btn.removeEventListener('click',callback)
// })

//observable creator
const fromEvent = (target,type) =>{
    return {
        subscribe:observer => {
            target.addEventListener(type, observer.next);
            return {
                unsubscribe:() => {
                    target.removeEventListener(type, observer.next)
                }
            }
        }
    }
}

const interval = time =>{
    return {
        subscribe: observer => {
            const handler = setInterval(observer.next,time);
            return {
                unsubscribe: ()=> {
                    clearInterval(handler);
                }
            }
        }
    }
}

const click$ = fromEvent(btn,'click');

// const subscription = click$.subscribe({
//     next: e => {
//         console.log('evento', e);

//         subscription.unsubscribe();

//         const timer$ = interval(1000);

//         timer$.subscribe({
//             next:()=>{
//                 console.log('Interval')
                
//             }
//         })
//     }
// })

//Observable operator
//map:: f -> Observable ->Observable

const map =projectionFn =>source=>{
    return{
        subscribe:observer =>{
            const innerObserver = {
                next:sourceValue => {
                    const newValue = projectionFn(sourceValue);
                    observer.next(newValue);
                }
            }
            const sourceSubscription = source.subscribe(innerObserver)
            return {
                unsubscrib: ()=>{
                    sourceSubscription.unsubscribe

                }
            }
        }
    }
}

//filter :: f -> Observable -> Observable

const filter =testFn =>source=>{
    return{
        subscribe:observer =>{ 
            const innerObserver = {
                next:sourceValue => {
                    const meetsCondition = testFn(sourceValue);
                    if(meetsCondition){
                        observer.next(sourceValue);
                    }
                }
            }
            const sourceSubscription = source.subscribe(innerObserver)
            return {
                unsubscribe: ()=>{
                    sourceSubscription.unsubscribe

                }
            }
        }
    }
}


const mapper = map(e =>({x:e.clientX,y:e.clientY}));
const over40 = filter(({x}) => x > 40);

const coord$ =mapper(click$);
const filteredCoord$ = over40(coord$);

const subscription = filteredCoord$.subscribe({
    next:coords => {
        console.log(coords)
    }
})
// const subscription = coord$.subscribe({
//     next:coords => {
//         console.log(coords)
//     }
// })

//const subscription = click$.subscribe({
    next: e => {
        console.log({x:e.clientX,y:e.clientY});

        //subscription.unsubscribe();

        // const timer$ = interval(1000);

        // timer$.subscribe({
        //     next:()=>{
        //         console.log('Interval')
                
        //     }
        // })
    }
//})

