import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import authService from "../services/authServices";
import { useMutation } from "@tanstack/react-query";

type FormData = {
   name: string;
   email: string;
   password: string;
};

function SignupForm() {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();

   const signupMutation = useMutation({
      mutationFn: async (data: FormData) => await authService.signup(data),
   });

   const onSubmit = (data: FormData) => {
      signupMutation.mutate(data);
   };

   return (
      <form
         onSubmit={handleSubmit(onSubmit)}
         className="bg-gray-100 max-w-96 p-12 shadow-md space-y-2 rounded-lg"
      >
         <h1 className="text-xl font-bold">Signup</h1>
         <div>
            Already have an account?{" "}
            <Link to={"/login"} className="text-blue-700">
               Login
            </Link>
         </div>

         <div className="flex flex-col">
            <label>Name:</label>
            <input
               className="border px-2 rounded"
               {...register("name", {
                  required: "Name is required",
                  minLength: {
                     value: 2,
                     message: "Name must be at least 2 characters",
                  },
               })}
            />
            {errors.name && <p className="text-red-600">{errors.name.message}</p>}
         </div>

         <div className="flex flex-col">
            <label>Email:</label>
            <input
               className="border px-2 rounded"
               {...register("email", {
                  required: "Email is required",
                  pattern: {
                     value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                     message: "Invalid email address",
                  },
               })}
            />
            {errors.email && <p className="text-red-600">{errors.email.message}</p>}
         </div>

         <div className="flex flex-col">
            <label>Password:</label>
            <input
               className="border px-2 rounded"
               type="password"
               {...register("password", {
                  required: "Password is required",
                  minLength: {
                     value: 6,
                     message: "Password must be at least 6 characters",
                  },
               })}
            />
            {errors.password && <p className="text-red-600">{errors.password.message}</p>}
         </div>

         {signupMutation.isError && (
            <p className="text-red-600">{signupMutation.error.message}</p>
         )}

         {signupMutation.isSuccess && (
            <p className="text-green-700">
               Signup successful. Please{" "}
               <Link to="/login" className="text-blue-700 font-medium">
                  Login
               </Link>
            </p>
         )}

         <button
            disabled={signupMutation.isPending || signupMutation.isSuccess}
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white rounded-md py-1"
         >
            Signup
         </button>
      </form>
   );
}

export default SignupForm;
