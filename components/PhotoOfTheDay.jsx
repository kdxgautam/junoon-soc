"use client";

import { useState, useEffect, useRef } from "react";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { client } from "@/sanity/client";

const POSTS_QUERY = `*[_type == 'post'] | order(_createdAt desc)[0] {
  title,
  image {
    asset -> {
      url
    }
  },
  body, ShotBy,insta
}`;

const options = { next: { revalidate: 30 } };

export default function PhotoOfTheDay() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  async function fetchPost() {
    try {
      const postData = await client.fetch(POSTS_QUERY, {}, options);
      setPost(postData);
    } catch (err) {
      setError("Failed to fetch post");
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{ backgroundColor: "rgb(27, 27, 27)", minHeight: "80vh" }}
    >
      <div className="container mx-auto py-12 text-white">
        <h1 className="mb-6 text-center text-4xl font-bold text-gray-100">
          Photo of the Day
        </h1>
        {error && <p className="text-center text-red-500">{error}</p>}
        {post?.image && (
          <div className="flex flex-col items-center justify-center gap-12 pt-10 lg:flex-row">
            {/* Left Section: Body */}
            <div className="leading-relaxed text-gray-300 lg:w-1/2">
              <blockquote className="border-l-4 border-blue-500 pl-4 text-lg italic">
                <PortableText value={post?.body} />
              </blockquote>
            </div>
            {/* Right Section: Image and Title */}
            <div className="group relative flex flex-col items-center lg:w-1/2">
            <div className="group flex items-center justify-center relative bg-darkest pb-4 pt-3 ">
              <Image
                src={post.image.asset.url}
                alt={post.title}
                width={500}
                height={450}
                className=" shadow-lg"
              />
              <a href={post?.insta} target="_blank" rel="noopener noreferrer" className="absolute bottom-7 right-0  w-44 bg-black/70 p-2 text-center opacity-0 transition-opacity duration-1000 group-hover:opacity-100">
                Shot By:<br/> @{post.ShotBy}
              </a>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-gray-100">
                {post.title}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
