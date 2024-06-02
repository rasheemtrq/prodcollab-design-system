

export default function ColorGrid() {
    return (
        <div className="grid grid-cols-4 grid-rows-2 gap-4">
            <div className="flex flex-col justify-between bg-primary w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Background Low</p>
                <p>#0A0A0B</p>
            </div>
            <div className="flex flex-col justify-between bg-secondary w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Background Medium</p>
                <p>#181819</p>
            </div>
            <div className="flex flex-col justify-between bg-tertiary w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Background High</p>
                <p>#28292B</p>
            </div>
            <div className="flex flex-col justify-between text-black bg-[#FFFFFF] w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Background Alternate</p>
                <p>#FFFFFF</p>
            </div>
            <div className="flex flex-col justify-between bg-[#3C82F6] w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Surface Brand</p>
                <p>#3C82F6</p>
            </div>
            <div className="flex flex-col justify-between bg-[#00B857] w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Surface Success</p>
                <p>#00B857</p>
            </div>
            <div className="flex flex-col justify-between bg-[#FFCE29] w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Surface Warning</p>
                <p>#FFCE29</p>
            </div>
            <div className="flex flex-col justify-between bg-[#ED5461] w-full h-[12rem] p-4 rounded-2xl border border-tertiary">
                <p>Surface Error</p>
                <p>#ED5461</p>
            </div>
        </div>
    );
}