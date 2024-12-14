import {Tooltip,TooltipContent,TooltipProvider,TooltipTrigger} from "@/components/ui/tooltip";
import {FaPlus} from "react-icons/fa"
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
import { animationDefaultOptions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect } from "react";
import { useAppStore } from "@/store";
  

const NewDm = () => {
    const [openNewContactModal,setOpenNewContactModal] = useState(false);
    const [searchedContacts,setSearchedContacts] = useState([]);
    const {setSelectedChatType, setSelectedChatData} = useAppStore();


    useEffect(() => {
      console.log("Searched Contacts Updated: ", searchedContacts);
    }, [searchedContacts]);
    
    const searchContacts = async(searchTerm) =>{
        try {
            if(searchTerm.length>0){
              console.log("search Term is " + searchTerm)
                const response = await apiClient.post(
                    SEARCH_CONTACTS_ROUTES,
                    { searchTerm },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data.contacts){
                    setSearchedContacts(response.data.contacts);
                }
            }
            else{
                setSearchedContacts([]);
            }
        }catch(error){
            console.log(error);
        }
    }
    const selectNewContact = (contact) => {
      setOpenNewContactModal(false);
      setSelectedChatType("contact");
      setSelectedChatData(contact);
      setSearchedContacts([]);
  }
    return (
    <>    
    <TooltipProvider>
        <Tooltip>
           <TooltipTrigger>
             <FaPlus className="text-neutral-400 text-opacity-90 font-light text-start hover:text-neutral-100 cursor-pointer transition-all duration-300" 
             onClick={()=>setOpenNewContactModal(true)} />
           </TooltipTrigger>
           <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
             <p>Select New Contact</p>
           </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
     <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
       <DialogHeader>
          <DialogTitle>Please select a contact</DialogTitle>
          <DialogDescription></DialogDescription>
       </DialogHeader>
        <div>
            <input
            placeholder="Search Contacts"
            className="rounded-lg p-6 w-full h-12 bg-[#2c2e3b] border-none " 
            onClick={(e) => searchContacts(e.target.value)}
            />
        </div>
{
  searchedContacts.length>0 &&



        <ScrollArea className="h-[250px]">
    <div className="flex flex-col gap-5">
        {searchedContacts.map((contact) => (
            <div key={ contact._id} className="flex gap-3 items-center cursor-pointer"
            onClick={()=>selectNewContact(contact)}
            >
               
               <div className="h-12 w-12 relative">
            <Avatar className="w-12 h-12 rounded-full overflow-hidden">
               { contact.image ? (
                <AvatarImage 
                src={`${HOST}/${contact.image}`} 
                alt="profile" 
                className="object-cover w-full h-full bg-black rounded-full"
                 /> ) : (
            <div 
              className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full 
              ${getColor(contact.color)}`}
            > 
              {contact.firstName ?  
              contact.firstName.split("").shift() : 
              contact.email.split("").shift()}
            </div> 
            )}
            </Avatar>   
            </div>

                 <div className="flex flex-col">
                    <span>
                    {contact.firstName && contact.lastName
                    ? `${contact.firstName} ${contact.lastName}`
                    : contact.email }
                    </span>
                    <span className="text-xs"> 
                        {contact.email}
                    </span>
                 </div>
            </div>
        ))}
    </div>
        </ScrollArea>
}
        {
            searchedContacts.length<=0 && ( <div className="flex-1 md:flex mt-5 md:mt-0 flex:col justify-center items-center duration-1000 transition-all">
              <Lottie
              isClickToPauseDisabled={true}
              height={100}
              width={100}
              options={animationDefaultOptions}      
              />
        
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
              <h3 className="poppins-medium">
        Hi<span className="text-purple-500">!</span>
       Search new
        <span className="text-purple-500"> Contact </span>
        <span className="text-purple-500">.</span>
        </h3>
                
        
              </div>
            </div>)
        }
     </DialogContent>
    </Dialog>

    </>
    );
};


export default NewDm;