import './App.css';
import { animated, to, useSpring } from '@react-spring/web'




function BeierCurve(props) {
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
    return [coord[0], coord[1] + (i+1 == arr.length ? 0 : topdropheight + drops.randomnesstop[((i+1)*2)])  ]
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
    if (i==0 ) { return [coord[0], coord[1] + topdropheight + drops.randomnesstop[(i)]] }
    if ((i+1) % 2 == 0) {
      return [coord[0], coord[1] + topdropheight + drops.randomnesstop[(i-1)]]
    }
    else if ((i+1) % 2 == 1) {
      return [coord[0], coord[1] + topdropheight +  drops.randomnesstop[(i+1)]]
    }
    
  });

  

  const start_cp = [0, 0];
  
  function generatePath(n, point) {
    //type is a bool. generate p1 if false, p2 if true
    const end_cp = [n*100, 0];
    let pathstring = "M 0,0 \n";
    console.log(topctrl_p2)
    for (let i = 0; i < n; i++) {
      if (point == "p1") {
        pathstring += `C ${i===0 ? start_cp : topctrl_p1[i*2+1]} ${bottomctrl_p1[i*2]} ${bottomendcoords_p1[i]} \n`
        pathstring += `C ${bottomctrl_p1[i*2+1]} ${i+1===n ? end_cp : topctrl_p1[i*2]} ${topendcoords_p1[i]} \n`
      } else if (point == "p2") {
        pathstring += `C ${i===0 ? start_cp : topctrl_p2[i*2+1]} ${bottomctrl_p2[i*2]} ${bottomendcoords_p2[i]} \n`
        pathstring += `C ${bottomctrl_p2[i*2+1]} ${i+1===n ? end_cp : topctrl_p2[i*2]} ${topendcoords_p2[i]} \n`
      }
    }
    return pathstring
  }



  //console.log(topctrl_p1)

  const old_p1 = `
  M 0,0 
  C 50,0             ${bottomctrl_p1[0]} ${bottomendcoords_p1[0]}
  C ${bottomctrl_p1[1]} ${topctrl_p1[0]} ${topendcoords_p1[0]}
  C ${topctrl_p1[1]} ${bottomctrl_p1[2]} ${bottomendcoords_p1[1]}
  C ${bottomctrl_p1[3]} ${topctrl_p1[2]} ${topendcoords_p1[1]}
  C ${topctrl_p1[3]} ${bottomctrl_p1[4]} ${bottomendcoords_p1[2]}
  C ${bottomctrl_p1[5]} ${topctrl_p1[4]} ${topendcoords_p1[2]}
  
  `
  const p1 = generatePath(numberofdrops, "p1")
  //console.log(p1)
  const old_p2 = `
  M 0,0 
  C 50,0                ${bottomctrl_p2[0]} ${bottomendcoords_p2[0]}
  C ${bottomctrl_p2[1]} ${topctrl_p2[0]} ${topendcoords_p2[0]}
  C ${topctrl_p2[1]} ${bottomctrl_p2[2]} ${bottomendcoords_p2[1]}
  C ${bottomctrl_p2[3]} ${topctrl_p2[2]} ${topendcoords_p2[1]}
  C ${topctrl_p2[3]} ${bottomctrl_p2[4]} ${bottomendcoords_p2[2]}
  C ${bottomctrl_p2[5]} ${topctrl_p2[4]} ${topendcoords_p2[2]}

  `
  
  const p2 = generatePath(numberofdrops, "p2");
  console.log(p2)


  let x = props.x;
  return(
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
  );
}



function App() {
  
  const [{ x }, set] = useSpring(() => ({
    from: {x: 0},
    to: {x: 100},
    loop: true,
    config: {
      mass: 10,
      friction: 220,
      tension: 80,
    },
  }));

  return (
    <div className="App">
      <BeierCurve x={x} />
    </div>
  );
}

export default App;
