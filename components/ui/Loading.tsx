'use client';
import React from 'react';
import { Grid } from 'ldrs/react';
import 'ldrs/react/Grid.css'

function Loading() {

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Grid
        size={100}
        speed="1"
        color="hsl(var(--primary))"
      />
    </div>
  );
}

export default Loading;
