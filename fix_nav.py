with open("src/App.jsx", "r", encoding="utf-8") as f:
    c = f.read()

# BottomNav solo en trips y booking, no en terminal ni home
c = c.replace(
    """      {page !== "home" && (
        <BottomNav active={page === "booking" ? "search" : page} onNav={(p) => {
          if (p === "search") goHome();
          else setPage(p);
        }}/>
      )}""",
    """      {(page === "booking" || page === "trips") && (
        <BottomNav active={page === "booking" ? "search" : page} onNav={(p) => {
          if (p === "search") goHome();
          else setPage(p);
        }}/>
      )}"""
)

with open("src/App.jsx", "w", encoding="utf-8") as f:
    f.write(c)
print("OK")