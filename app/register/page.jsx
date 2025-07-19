import RegisterComp from "@/components/RegisterComp";
export default function register() {
    return(
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
            <RegisterComp/>
          </div>
        </div>
        )    
}