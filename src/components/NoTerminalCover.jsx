import { BounceLoader } from "react-spinners";
export const NoTerminalCover = () => {
  return (
      <div className='no-terminal-cover'>
          <div className="loader-wrapper">
                     <BounceLoader
              size={350}
              color={"#FF6A14"}
              />
              <div className="loader-text-wrap">
                    <h1 className="loader-text">Триває підключення до терміналу</h1>
              </div>
            
          </div>
   
    </div>
  )
}

