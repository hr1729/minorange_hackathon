import React from "react"
import { Link } from "react-router-dom"
import { cn } from "../../lib/utils"

const Navbar = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      className={cn(
        "flex h-16 items-center border-b bg-background px-6",
        className
      )}
      {...props}
    >
      <div className="flex w-full items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          Logo
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-primary">
            Home
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  )
})
Navbar.displayName = "Navbar"

export { Navbar }
