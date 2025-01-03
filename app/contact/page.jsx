import ContactUsForm from "@/components/ContactUsForm";
import SocialLinks from "@/components/SocialLinks";
import fetchData from "@/lib/sanity/fetchData";

export default async function About() {
  const contact = await fetchData("contact", {}, "[0]");


  return (
    <main className="my-auto">
      <div className="mx-auto max-w-5xl p-4 pt-24 text-center md:w-1/2">
      <h1 className="mb-10">Click, Shoot, Connect with Junnon!</h1>
      
        <h4 className="mb-10">{contact.subheading}</h4>
        
        
          <ContactUsForm />
       
        <SocialLinks
          containerStyle="grid-flow-row md:grid-flow-col gap-14 pt-10"
          iconStyle="mb-2 text-blue-400"
          lg
          showText
        />
      </div>
    </main>
  );
}
