import { initialData } from "./seed"


async function main(){
  console.log('initialData', initialData)
}

(() => {
  if ( process.env.NODE_ENV !== 'development' ) {
    console.error('Seed script should be run only in development environment');
    return;    
  }
  
  main();
})();