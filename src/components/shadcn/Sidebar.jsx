import React, { useState } from "react"
import { cn } from "../../lib/utils"
import * as Collapsible from "@radix-ui/react-collapsible"
import { ChevronRight } from "lucide-react"

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        "fixed left-0 top-16 z-20 flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-background transition-all duration-300",
        !isOpen && "w-16",
        className
      )}
      {...props}
      ref={ref}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-end border-b p-4">
          <Collapsible.Trigger asChild>
            <button className="rounded-md p-2 hover:bg-accent">
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>
          </Collapsible.Trigger>
        </div>
        <Collapsible.Content
          className="flex-1 overflow-auto p-4"
          forceMount
          style={{
            display: isOpen ? "block" : "none",
          }}
        >
          {children}
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  )
})
Sidebar.displayName = "Sidebar"

export { Sidebar }
