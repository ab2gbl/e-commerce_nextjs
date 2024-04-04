
import Link from "next/link";

export default function Navbar() {
    
    return(
        
        <div className="w-full grid grid-cols-2">
              <Link href={'/'}>Home</Link>
              <Link href={`/cart`}>Cart</Link>
              
        </div>
    )
}