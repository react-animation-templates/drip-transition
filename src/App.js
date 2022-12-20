import './App.css';
import { animated, to, useSpring } from '@react-spring/web'




function BeierCurve(props) {
  const topendcoords_p1 = [[100, 0], [200, 0]];
  const topendcoords_p2 = topendcoords_p1.map((coord) => {
    return [coord[0], coord[1] + Math.random() * 0]
  });
  const bottomendcoords_p1 = [[50, 50], [150, 50]];
  const bottomendcoords_p2 = bottomendcoords_p1.map((coord) => {
    return [coord[0], coord[1] + 150 + Math.random() * 0]
  });
  
  const bottomctrl_p1 = [[-20, 50], [150, 50], [50, 50], [250, 50]];
  const bottomctrl_p2 = bottomctrl_p1.map((coord) => {
    return [coord[0], coord[1] + 150 + Math.random() * 0]
  });

  const start_cp = [50, 0]
  const p1 = `
  M 0,0 
  C ${start_cp} ${bottomctrl_p1[0]} ${bottomendcoords_p1[0]}
  C ${bottomctrl_p1[1]} 0,0 ${topendcoords_p1[0]}
  C 200,0 ${bottomctrl_p1[2]} ${bottomendcoords_p1[1]}
  C ${bottomctrl_p1[3]} 150,0 ${topendcoords_p1[1]}
  `
  const p2 = `
  M 0,0 
  C ${start_cp} ${bottomctrl_p2[0]} ${bottomendcoords_p2[0]}
  C ${bottomctrl_p2[1]} 0,0 ${topendcoords_p2[0]}
  C 200,0 ${bottomctrl_p2[2]} ${bottomendcoords_p2[1]}
  C ${bottomctrl_p2[3]} 150,0 ${topendcoords_p2[1]}
  `

  let x = props.x;
  console.log(x)
  return(
    <svg
      viewBox="0 0 200 200"
      style={{ width: "50vw", backgroundColor: "white" }}>
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
      mass: 1,
      friction: 20,
      tension: 50,
    },
  }));

  return (
    <div className="App">
      <BeierCurve x={x} />
    </div>
  );
}

export default App;
