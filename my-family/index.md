---
layout: simple-post
title: My Family
permalink: /my-family/
description: My Family
---

<style>
  /* Local styles for My Family page - 2x taller images */
  #my-family .card-image {
    height: 240px !important;
    min-height: 240px !important;
  }
  #my-family .card-image img {
    height: 100% !important;
    min-height: 240px !important;
    object-fit: cover !important;
  }
  @media (min-width: 1920px) {
    #my-family .card-image { height: 280px !important; min-height: 280px !important; }
    #my-family .card-image img { min-height: 280px !important; }
  }
  @media (min-width: 1200px) and (max-width: 1919px) {
    #my-family .card-image { height: 200px !important; min-height: 200px !important; }
    #my-family .card-image img { min-height: 200px !important; }
  }
  @media (max-width: 768px) {
    #my-family .card-image { height: 300px !important; min-height: 300px !important; }
    #my-family .card-image img { min-height: 300px !important; }
  }
  @media (max-width: 480px) {
    #my-family .card-image { height: 240px !important; min-height: 240px !important; }
    #my-family .card-image img { min-height: 240px !important; }
  }
</style>

<section id="my-family" class="education-section">
  <div class="education-grid">
    <div class="post-view education-card">
      <div class="summary">
        <div class="card-image" style="height: 240px !important; min-height: 240px !important;">
          <img src="/assets/images/education/mum.jpg" alt="Mum" style="height: 100% !important; min-height: 240px !important; object-fit: cover !important;">
        </div>
        <div class="title-header">
          <h3>My Mother</h3>
        </div>
      </div>
      <div class="content">
        <p class="education-detail">Gemma G. Alcuizar - My home, The woman who has taught me how to live.</p>
      </div>
    </div>

  <div class="post-view education-card">
      <div class="summary">
        <div class="card-image" style="height: 240px !important; min-height: 240px !important;">
          <img src="/assets/images/education/dad.jpg" alt="Dad" style="height: 100% !important; min-height: 240px !important; object-fit: cover !important;">
        </div>
        <div class="title-header">
          <h3>My Father</h3>
        </div>
      </div>
      <div class="content">
        <p class="education-detail">Herminio G. Alcuizar Jr. - My compass, The man who has taught me the intricacies of life.</p>
      </div>
    </div>

  <div class="post-view education-card">
      <div class="summary">
        <div class="card-image" style="height: 240px !important; min-height: 240px !important;">
          <img src="/assets/images/education/bro.jpg" alt="Bro" style="height: 100% !important; min-height: 240px !important; object-fit: cover !important;">
        </div>
        <div class="title-header">
          <h3>My Brother</h3>
        </div>
      </div>
      <div class="content">
        <p class="education-detail">Mark Gio G. Alcuizar - My first friend, The friend who had taught me how to build Arlecchino.</p>
      </div>
    </div>
  </div>
</section>
