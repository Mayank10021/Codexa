export default function LoadingState({ message = 'Analyzing with AI' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-cx-indigo-mid" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cx-indigo animate-spin" />
        <div className="absolute inset-2.5 rounded-full bg-cx-indigo-light animate-pulse" />
      </div>
      <div className="text-center">
        <p className="font-body font-semibold text-cx-sub text-sm">{message}</p>
        <p className="text-cx-faint text-xs mt-1 font-body">Powered by Llama 3.3 70B via Groq</p>
      </div>
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-cx-indigo-mid animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  )
}
