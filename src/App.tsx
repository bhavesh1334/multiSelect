import { useState } from 'react'
import './App.css'
import Select from './components/Select'

interface ISelectOption {
  label: string;
  value: string | number;
}

const options: ISelectOption[] = [
  { label: "one", value: 1 },
  { label: "two", value: 2 },
  { label: "three", value: 3 },
  { label: "four", value: 4 },
  { label: "five", value: 5 },
]

function App() {
  const [selectedValue, setSelectedValue] = useState<ISelectOption | undefined>(options[0])
  const [selectedValue1, setSelectedValue1] = useState<ISelectOption[]>([options[0]])

  return (
    <div className="">
      <Select options={options} value={selectedValue} onChange={e => setSelectedValue(e)} />
      <br />
      <Select multiple options={options} value={selectedValue1} onChange={e => setSelectedValue1(e)} />
    </div>
  )
}

export default App
