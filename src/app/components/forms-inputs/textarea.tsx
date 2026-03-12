
export default function Textarea({value, onChangeAction, placeholder}: {value: string, onChangeAction: (newValue: string) => void, placeholder?: string}) {

    return (
        <textarea
            className={"focus:outline-0 md:hover:bg-on-background bg-background focus:bg-on-background border-2 border-on-background rounded-xl outline-0 p-2 w-full h-64 min-h-64 max-h-64 resize-none"}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChangeAction(e.target.value)}
        />
    )
}