import { Search } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const SearchProduct=()=>{
    return (
        <div className="flex w-full max-w-md items-center space-x-2">
            <Input type="text" placeholder="Search Product..." className="flex-1"/>
            <Button variant={"default"}>
                <Search className="size-4 mr-2"/>
                Search
            </Button>
        </div>
    )
}