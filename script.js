const books = [
  {id:1,title:"The Silent Patient",author:"Alex Michaelides",category:"Mystery",price:14.99,tag:"Bestseller",cover:"cover-1",short:"SILENT",description:"A gripping psychological mystery about a famous painter who stops speaking after a shocking event. A therapist becomes determined to uncover the truth."},
  {id:2,title:"The Midnight Library",author:"Matt Haig",category:"Fiction",price:16.50,tag:"Reader favorite",cover:"cover-2",short:"MIDNIGHT",description:"Between life and death lies a library of possibilities. Nora explores the many lives she might have lived and considers what makes a life meaningful."},
  {id:3,title:"Atomic Habits",author:"James Clear",category:"Personal Growth",price:18.00,tag:"Popular",cover:"cover-3",short:"ATOMIC",description:"A practical guide to building helpful routines, breaking unhelpful ones, and making small improvements that add up over time."},
  {id:4,title:"The Psychology of Money",author:"Morgan Housel",category:"Business",price:17.25,tag:"Editor's pick",cover:"cover-4",short:"MONEY",description:"A collection of stories exploring how people think about money, make financial decisions, and define what enough means."},
  {id:5,title:"The Hobbit",author:"J.R.R. Tolkien",category:"Fiction",price:15.75,tag:"Classic",cover:"cover-5",short:"HOBBIT",description:"Bilbo Baggins leaves his quiet home and joins a company of dwarves on an unexpected adventure across Middle-earth."},
  {id:6,title:"Deep Work",author:"Cal Newport",category:"Personal Growth",price:19.00,tag:"Focus better",cover:"cover-6",short:"DEEP WORK",description:"An exploration of focused, distraction-free work and how developing this skill can help people produce meaningful results."},
  {id:7,title:"Clean Code",author:"Robert C. Martin",category:"Technology",price:32.00,tag:"Tech pick",cover:"cover-7",short:"CLEAN CODE",description:"A software craftsmanship guide that discusses readable code, maintainability, naming, functions, and practical refactoring principles."},
  {id:8,title:"The Da Vinci Code",author:"Dan Brown",category:"Mystery",price:13.50,tag:"Page-turner",cover:"cover-8",short:"DA VINCI",description:"A fast-paced mystery follows a symbologist and a cryptologist as they investigate clues connected to an ancient secret."}
];
let cart = [];
let wishlist = new Set();
let activeCategory = "All";
const grid = document.getElementById("bookGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const toast = document.getElementById("toast");

function showToast(message){
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(()=>toast.classList.remove("show"),2100);
}
function renderBooks(){
  const query = searchInput.value.trim().toLowerCase();
  const filtered = books.filter(book =>
    (activeCategory === "All" || book.category === activeCategory) &&
    (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query))
  );
  grid.innerHTML = filtered.map(book => `
    <article class="book-card">
      <div class="cover-wrap" data-details="${book.id}" role="button" tabindex="0" aria-label="View details for ${book.title}">
        <span class="book-tag">${book.tag}</span>
        <button class="wish-button ${wishlist.has(book.id)?"saved":""}" data-wish="${book.id}" aria-label="Save ${book.title} to wishlist">${wishlist.has(book.id)?"♥":"♡"}</button>
        <div class="cover ${book.cover}"><span class="cover-title">${book.short}</span><span class="cover-ornament">✳</span><span class="cover-author">${book.author.toUpperCase()}</span></div>
      </div>
      <p class="book-category">${book.category}</p><h3 class="book-title" data-details="${book.id}" role="button" tabindex="0">${book.title}</h3>
      <p class="book-author">by ${book.author}</p>
      <div class="book-bottom"><span class="price">$${book.price.toFixed(2)}</span><button class="add-button" data-add="${book.id}">+ Add to cart</button></div>
    </article>`).join("");
  document.getElementById("emptyState").classList.toggle("hidden", filtered.length !== 0);
}
function renderCart(){
  const cartItems = document.getElementById("cartItems");
  const count = cart.reduce((sum,item)=>sum+item.quantity,0);
  const subtotal = cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("summaryItems").textContent = count;
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("total").textContent = `$${subtotal.toFixed(2)}`;
  if(!cart.length){
    cartItems.innerHTML = '<p class="cart-empty">Your cart is waiting for its first story. Browse the collection and add a book you love.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item=>`
    <div class="cart-row">
      <div class="mini-cover ${item.cover}">${item.short}</div>
      <div><div class="cart-book-title">${item.title}</div><div class="cart-book-author">by ${item.author} · Qty ${item.quantity}</div></div>
      <span class="cart-price">$${(item.price*item.quantity).toFixed(2)}</span>
      <button class="remove-button" data-remove="${item.id}" aria-label="Remove ${item.title}">×</button>
    </div>`).join("");
}
grid.addEventListener("click",event=>{
  const addButton = event.target.closest("[data-add]");
  const wishButton = event.target.closest("[data-wish]");
  const detailsTarget = event.target.closest("[data-details]");
  if(detailsTarget && !wishButton){
    openBookDetails(Number(detailsTarget.dataset.details));
  }
  if(addButton){
    const book = books.find(item=>item.id===Number(addButton.dataset.add));
    const existing = cart.find(item=>item.id===book.id);
    if(existing) existing.quantity++; else cart.push({...book,quantity:1});
    renderCart(); showToast(`${book.title} added to your cart.`);
  }
  if(wishButton){
    const id = Number(wishButton.dataset.wish);
    if(wishlist.has(id)){wishlist.delete(id);showToast("Removed from your wishlist.");}
    else{wishlist.add(id);showToast("Saved to your wishlist.");}
    renderBooks();
  }
});
document.getElementById("cartItems").addEventListener("click",event=>{
  const button = event.target.closest("[data-remove]");
  if(!button)return;
  cart = cart.filter(item=>item.id!==Number(button.dataset.remove));
  renderCart(); showToast("Book removed from your cart.");
});
searchInput.addEventListener("input",renderBooks);
categoryFilter.addEventListener("change",()=>{
  activeCategory=categoryFilter.value;
  document.querySelectorAll(".pill").forEach(pill=>pill.classList.toggle("active",pill.dataset.category===activeCategory));
  renderBooks();
});
document.getElementById("categoryPills").addEventListener("click",event=>{
  const pill=event.target.closest("[data-category]");
  if(!pill)return;
  activeCategory=pill.dataset.category;
  categoryFilter.value=activeCategory;
  document.querySelectorAll(".pill").forEach(item=>item.classList.toggle("active",item===pill));
  renderBooks();
});
document.getElementById("checkoutButton").addEventListener("click",()=>{
  if(!cart.length){showToast("Your cart is empty — find a book first!");return;}
  showToast("Demo only: checkout is not connected to payments.");
});
const menuToggle=document.getElementById("menuToggle");
const mainNav=document.getElementById("mainNav");
menuToggle.addEventListener("click",()=>{
  const open=mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded",String(open));
});
mainNav.addEventListener("click",event=>{
  if(event.target.closest("a")){mainNav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");}
});
const bookDialog=document.getElementById("bookDialog");
let selectedDialogBook=null;
function openBookDetails(id){
  const book=books.find(item=>item.id===id);
  if(!book)return;
  selectedDialogBook=book;
  const dialogCover=document.getElementById("dialogCover");
  dialogCover.className=`cover dialog-cover ${book.cover}`;
  dialogCover.innerHTML=`<span class="cover-title">${book.short}</span><span class="cover-ornament">✳</span><span class="cover-author">${book.author.toUpperCase()}</span>`;
  document.getElementById("dialogCategory").textContent=book.category.toUpperCase();
  document.getElementById("dialogTitle").textContent=book.title;
  document.getElementById("dialogAuthor").textContent=`by ${book.author}`;
  document.getElementById("dialogDescription").textContent=book.description;
  document.getElementById("dialogPrice").textContent=`$${book.price.toFixed(2)}`;
  bookDialog.showModal();
}
document.getElementById("dialogClose").addEventListener("click",()=>bookDialog.close());
bookDialog.addEventListener("click",event=>{
  if(event.target===bookDialog)bookDialog.close();
});
document.getElementById("dialogAdd").addEventListener("click",()=>{
  if(!selectedDialogBook)return;
  const existing=cart.find(item=>item.id===selectedDialogBook.id);
  if(existing)existing.quantity++;else cart.push({...selectedDialogBook,quantity:1});
  renderCart();bookDialog.close();showToast(`${selectedDialogBook.title} added to your cart.`);
});
grid.addEventListener("keydown",event=>{
  if((event.key==="Enter"||event.key===" ") && event.target.matches("[data-details]")){
    event.preventDefault();openBookDetails(Number(event.target.dataset.details));
  }
});
document.getElementById("year").textContent=new Date().getFullYear();
renderBooks();renderCart();
