
export default function ErrorMessage({children}: { children: string | undefined; } )  {
    return(
        <p 
        className="text-red-400 font-bold"
        >
        {children}
        </p>
    )
}