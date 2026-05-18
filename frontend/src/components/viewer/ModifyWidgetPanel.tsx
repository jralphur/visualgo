import ModifyWidgetRow from "./ModifyWidgetRow"
import type { WidgetDataItem } from "./types"

interface ModifyWidgetPanelProps<T extends WidgetDataItem> {
    widget?: T;
    render?: [x: keyof T, y: () => string][]
    onSubmit?: [x: keyof T, y: () => void][]
};


const ModifyWidgetPanel = <T extends WidgetDataItem>({ widget, render }: ModifyWidgetPanelProps<T>) => {
    if (!widget) return <div></div>
    return (
        <table>
            {Object.entries(widget).map(([prop, value]) => {
                const co = render ? render[1][1]() : value

                return <ModifyWidgetRow key={prop} propertyName={prop} propertyValue={co ? co : value} />
            })}
        </table>
    )
}

export default ModifyWidgetPanel