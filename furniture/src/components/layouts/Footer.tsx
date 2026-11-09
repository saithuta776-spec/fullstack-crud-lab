// import { siteConfig } from "@/config/site";
// import { Icons } from "@/components/ui/icons";
// import { Link } from "react-router";
// export default function Footer() {
//   return (
//     <footer className="w-full border-t ml-4 lg:ml-0">
//       <div className="container mx-auto pb-8 pt-4">
//         <section className="flex flex-col md:flex-row gap-10  lg:gap-20">
//           <section>
//             <Link to="/" className="flex items-center space-x-2">
//               <Icons.logo className="size-6" aria-hidden="true" />
//               <span className="font-bold">{siteConfig.name}</span>
//               <span className="sr-only"></span>
//             </Link>
//           </section>
//           <section className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-10">
//             {siteConfig.footerNav.map((foot) => (
//               <div className="space-y-3">
//                 <h4 className="font-bold">{foot.title}</h4>
//                 <ul className="">
//                   {foot.items.map((data) => (
//                     <li key={data.title}>
//                       <Link
//                         to={data.href}
//                         target={data.external ? "_blank" : undefined}
//                         className="text-muted-foreground text-sm hover:text-foreground"
//                       >
//                         {data.title}
//                         <span className="sr-only">{data.title}</span>
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </section>
//         </section>x
//       </div>
//     </footer>
//   );
// }
