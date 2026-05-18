import { type SubmitEventHandler, useState } from "react";

type ModifyWidgetRowProps = {
    readonly propertyName: string; 
    readonly propertyValue: string
    onSubmit?: () => void;
}
const ModifyWidgetRow = ({propertyName, propertyValue, onSubmit}: ModifyWidgetRowProps) =>  {
    const [value, setValue] = useState(propertyValue)
    const handleSubmit: SubmitEventHandler<HTMLInputElement> = (e) => {
        e.preventDefault();

    }
    const valueElement = onSubmit ? <input value={value} onChange={e => setValue(e.target.value)} onSubmit={handleSubmit} /> 
                                  : <span>{propertyValue}</span>
    return (
        <tr>
            <td>{propertyName}</td>
            <td>{valueElement}</td>
        </tr>
    )
}

export default ModifyWidgetRow