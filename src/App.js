import './App.css';
import { animated, useSpring } from '@react-spring/web'

function BeierCurve(props) {
  //SET VARIABLES HERE
  const numberofdrops = 15;
  const dropheight = window.innerHeight + 500;
  const topdropheight = window.innerHeight
  const randomnessaddition = 1000;
  const toprandomnessaddition = 300;


  function generateDrops(n) {
    let drops = {topend: [], bottomend: [], bottomctrl: [], topctrl: [], randomness: [], randomnesstop: [0,0,0]};
    for (let i = 1; i < n; i++) {
      drops.topend.push([i*100, 0]);
      drops.bottomend.push([i*100-50, 50]);
      drops.bottomctrl.push([i*100-150, 50], [i*100+50, 50]);
      drops.topctrl.push([(i)*100-100, 0], [(i)*100+0, 0])
      const random = Math.floor(Math.random() * randomnessaddition)
      drops.randomness.push(random, random);
      const randomtop = Math.floor(Math.random() * toprandomnessaddition)
      drops.randomnesstop.push(randomtop, randomtop);
    }
    return drops
  }
  const drops = generateDrops(numberofdrops+1);
  const topendcoords_p1 = drops.topend;
  const topendcoords_p2 = topendcoords_p1.map((coord, i, arr) => {
    return [coord[0], coord[1] + (i+1 === arr.length ? 0 : topdropheight + drops.randomnesstop[((i+1)*2)])  ]
  });
  
  const bottomendcoords_p1 = drops.bottomend;
  const bottomendcoords_p2 = bottomendcoords_p1.map((coord, i) => {
    return [coord[0], coord[1] + dropheight + drops.randomness[i*2]]
  });
  
  const bottomctrl_p1 = drops.bottomctrl;
  const bottomctrl_p2 = bottomctrl_p1.map((coord, i) => {
    return [coord[0], coord[1] + dropheight + drops.randomness[i]]
  });

  const topctrl_p1 = drops.topctrl;
  const topctrl_p2 = topctrl_p1.map((coord, i) => {
    if (i===0 ) { return [coord[0], coord[1] + topdropheight + drops.randomnesstop[(i)]] }
    if ((i+1) % 2 === 0) {
      return [coord[0], coord[1] + topdropheight + drops.randomnesstop[(i-1)]]
    }
    else if ((i+1) % 2 === 1) {
      return [coord[0], coord[1] + topdropheight +  drops.randomnesstop[(i+1)]]
    }
    else return null;
    
  });

  

  const start_cp = [0, 0];
  
  function generatePath(n, point) {
    //type is a bool. generate p1 if false, p2 if true
    const end_cp = [n*100, 0];
    let pathstring = "M 0,0 \n";
    console.log(topctrl_p2)
    for (let i = 0; i < n; i++) {
      if (point === "p1") {
        pathstring += `C ${i===0 ? start_cp : topctrl_p1[i*2+1]} ${bottomctrl_p1[i*2]} ${bottomendcoords_p1[i]} \n`
        pathstring += `C ${bottomctrl_p1[i*2+1]} ${i+1===n ? end_cp : topctrl_p1[i*2]} ${topendcoords_p1[i]} \n`
      } else if (point === "p2") {
        pathstring += `C ${i===0 ? start_cp : topctrl_p2[i*2+1]} ${bottomctrl_p2[i*2]} ${bottomendcoords_p2[i]} \n`
        pathstring += `C ${bottomctrl_p2[i*2+1]} ${i+1===n ? end_cp : topctrl_p2[i*2]} ${topendcoords_p2[i]} \n`
      }
    }
    return pathstring
  }
  const p1 = generatePath(numberofdrops, "p1")
  const p2 = generatePath(numberofdrops, "p2");
  let x = props.x;
  let opacity = props.opacity;
  return(
    <>
    <div style={{display: "flex", flexDirection: "column", position: "fixed", width: "100vw", height: "50vh", alignItems: "center", top: "10vh", justifyContent: "center", fontFamily:"sans-serif", fontSize: "2em", mixBlendMode: "overlay"}}>
      <animated.h1 style={{opacity: opacity, }} >Dynamic React Drip Transition</animated.h1>
      <h3 style={{width: "80vw"}}>Fully dynamic and customisable drip transition using vanilla SVG & react-spring</h3>
      <h5>made with ❤️ by @mazzz</h5>
    </div>
    <svg
      width={window.innerWidth}
      height={window.innerHeight}
      style={{ width: "100vw", height: "100vh", backgroundColor: "white" }}>
        <animated.path
        
          d={x.to({
            range: [0, 100],
            output: [p1, p2], 
          })}
          fill="#bada55"
          stroke="#bada55"
          strokeWidth={1}
        />
    </svg>
    </>
  );
}



function App() {
  
  const [{ x, opacity }] = useSpring(() => ({
    from: {x: 0, opacity: 0},
    to: {x: 100, opacity: 1},
    loop: true,
    config: {
      mass: 10,
      friction: 220,
      tension: 80,
    },
  }));

  return (
    <div className="App">
      <BeierCurve x={x} opacity={opacity} />
    </div>
  );
}

export default App;
