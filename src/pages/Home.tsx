import * as React from "react";
import { useState } from "react";
import Header from "../templates/Header";
import { Footer } from "../templates/Footer";
import ItemCard from "../templates/ItemCard";

export default function Home() {
  return (
    <>
      <body className="flex flex-col min-h-screen">  
        <main className="flex-grow">
          <section className="container mx-auto px-4">
            <h1 className="my-6 text-center text-2xl font-bold">
              Sticky Footer with Tailwind CSS
            </h1>
            <p className="my-6 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
              purus risus, venenatis non arcu at, dictum euismod risus.
              Pellentesque faucibus dui sit amet eleifend gravida. Praesent
              dapibus sapien sit amet mauris tempor ultrices non luctus tellus.
            </p>
          </section>
          <section className="flex flex-wrap justify-center">
            {[...Array(10)].map(() => <ItemCard />)}
          </section>
        </main>
      </body>
    </>
  );
}
