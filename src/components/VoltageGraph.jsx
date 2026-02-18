import { useRef, useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer } from 'recharts'
import useStore from '../lib/store'

const MAX_POINTS = 100

export default function VoltageGraph() {
  const dataRef = useRef([])
  const [chartData, setChartData] = useState([{ t: 0, pre: -70, post: -70 }])

  useEffect(() => {
    // Sample voltage at ~20fps, render chart at ~10fps
    let frame = 0
    const sampleId = setInterval(() => {
      const { voltage, postVoltage } = useStore.getState()
      const data = dataRef.current
      const lastT = data.length > 0 ? data[data.length - 1].t : 0
      data.push({ t: +(lastT + 0.05).toFixed(2), pre: Math.round(voltage), post: Math.round(postVoltage) })
      if (data.length > MAX_POINTS) data.shift()
    }, 50)

    const renderId = setInterval(() => {
      setChartData([...dataRef.current])
    }, 100)

    return () => {
      clearInterval(sampleId)
      clearInterval(renderId)
    }
  }, [])

  return (
    <div className="voltage-graph">
      <div className="voltage-graph-title">Membrane Potential</div>
      <div className="voltage-graph-legend">
        <span className="legend-pre">Pre</span>
        <span className="legend-post">Post</span>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <LineChart data={chartData} margin={{ top: 5, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="t"
            tick={{ fontSize: 8, fill: '#555' }}
            interval="preserveStartEnd"
            tickCount={5}
          />
          <YAxis
            domain={[-90, 50]}
            tick={{ fontSize: 8, fill: '#555' }}
            tickCount={5}
          />
          <ReferenceLine y={-55} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 2" />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" />
          <ReferenceLine y={30} stroke="rgba(255,255,255,0.12)" strokeDasharray="2 2" />
          <Line type="monotone" dataKey="pre" stroke="#4caf50" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="post" stroke="#42a5f5" strokeWidth={1.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
