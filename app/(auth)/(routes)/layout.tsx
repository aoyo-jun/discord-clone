const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return ( 
        // 'children' is the authentication component by Clerk
        // Centers the div with the authentication component inside
        <div className="h-full flex items-center justify-center">
            {children}
        </div>
     );
}
 
export default AuthLayout;