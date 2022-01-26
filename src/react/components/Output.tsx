export interface Props {
  stdout?: string[]
  stderr?: string[]
  containerClass?: string
  headerClass?: string
  outputClass?: string
  errorClass?: string
}

function Output({
  stdout = [],
  stderr = [],
  containerClass = 'p-4 bg-[#141414] output-font',
  headerClass = 'output-font',
  outputClass = 'font-bold output-font',
  errorClass = 'text-[#FC4F60] output-font',
}: Props) {

  return (
    <div className={`flex-1 text-xs flex flex-column overflow-auto${containerClass}`}>
      <div className={headerClass}>OUTPUT</div>
      {stdout.map((out, idx) => (
        <span className={outputClass} key={`out_${idx}`}>{out}</span>
      ))}
      {stderr.map((out, idx) => (
        <span className={errorClass} key={`out_${idx}`}>{out}</span>
      ))}
    </div>
  )
}

export default Output