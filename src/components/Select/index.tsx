import React, { useEffect, useRef, useState } from 'react'
import styles from "./index.module.css"


interface ISelectOption {
    label: string;
    value: string | number;
}


interface ISelectProps {
    options: ISelectOption[];
}

interface ISingleSelectProps extends ISelectProps {
    multiple?: false;
    value?: ISelectOption;
    onChange: (value?: ISelectOption) => void
}
interface IMultipleSelectProps extends ISelectProps {
    multiple: true;
    value?: ISelectOption[];
    onChange: (value: ISelectOption[]) => void
}


const Select = ({ multiple, value, onChange, options }: ISingleSelectProps | IMultipleSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isOpen) setHighlightedIndex(0)
    }, [isOpen])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return

            switch (e.code) {
                case "Enter":
                case "Space":
                    setIsOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break;

                case "ArrowUp":
                case "ArrowDown": {
                    if (!isOpen) {
                        setIsOpen(true)
                        break
                    }
                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                    }
                    break;
                }
                case "Escape":
                    setIsOpen(false)
                    break;
            }
        }
        containerRef.current?.addEventListener("keydown", handler)
        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }
    }, [isOpen, highlightedIndex])



    const clearOptions = () => {
        multiple ? onChange([]) : onChange(undefined)
    }

    const selectOption = (option: ISelectOption) => {
        if (multiple) {
            if (value?.includes(option)) {
                onChange(value?.filter((o) => o !== option))
            } else {
                onChange([...(value as []), option])
            }
        } else {
            if (option !== value) {
                onChange(option)
            }
        }
    }


    const isOptionSelected = (option: ISelectOption) => {
        return multiple ? value?.includes(option) : option === value

    }

    return (
        <div ref={containerRef} onBlur={() => setIsOpen(false)} onClick={() => setIsOpen(prev => !prev)} tabIndex={0} className={styles.container}>
            <span className={styles.value}>{multiple ? value?.map((v) => (
                <button key={v.value} onClick={e => {
                    e.stopPropagation()
                    selectOption(v)
                }
                }
                    className={styles["option-badge"]}
                >
                    {v.label}
                    <span className={styles["remove-btn"]}>&times;</span>
                </button>
            )
            ) : value?.label}</span>
            <button onClick={(e) => {
                e.stopPropagation()
                clearOptions()
            }} className={styles["clear-btn"]}>&times;</button>
            <div className={styles.divider}></div>
            <div className={styles.caret}></div>
            <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
                {options.map((option, index) => (
                    <li onClick={e => {
                        e.stopPropagation()
                        selectOption(option)
                        setIsOpen(false)
                    }} key={option.value} onMouseEnter={() => setHighlightedIndex(index)} className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} ${highlightedIndex === index ? styles.highlighted : ""} `}>{option.label}</li>
                ))}
            </ul>
        </div>
    )
}

export default Select

