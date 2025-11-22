import{Y as d,g as c,R as e,l as v,r as f}from"./assets/main-4v0IdOIu.js";import"./assets/vendor-3BNOZKAJ.js";new d;function p(){e.favoritesList.innerHTML=`
    <div class="favorites-empty">
      <p>It appears that you haven’t added any exercises to your favorites yet.</p>
      <p>To get started, add exercises that you like to your favorites for easier access.</p>
    </div>`}function l(o){e.favoritesList.innerHTML="",o.forEach(t=>{const n=v(t),r=document.createElement("div");r.innerHTML=n.trim();const s=r.firstElementChild,a=s.querySelector(".favorites-delete-btn");a&&a.addEventListener("click",()=>{f(t.id),updateFavoritesPage()}),e.favoritesList.appendChild(s)})}const i=c();e.favoritesList&&(i.length?l(i):p());
//# sourceMappingURL=favorites.js.map
