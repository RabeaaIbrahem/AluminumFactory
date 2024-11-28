import React from "react";
import factoryImage from "../../img/aaa.jpg";
import classes from "./home.module.css";

function Home() {
  return (
    <main className={classes.home}>
      {/* Section for site information */}
      <section>
        <h2 className={classes.h2}>אודות האתר</h2>
        <p>
          ברוכים הבאים לאתר ניהול וארגון מפעל האלומיניום "הר אל". מטרת האתר היא
          לשדרג את יכולת הניהול וההזמנות במפעל, להקל על מנהל המפעל בעבודתו
          היומיומית, ולהפחית טעויות אנושיות
        </p>
      </section>
      <img
        src={factoryImage}
        alt="Aluminum Factory"
        className={classes.factoryImage}
      />
      {/* Section for site goals */}
      <section>
        <h2>מטרות האתר</h2>
        <div className={classes.goals}>
          <div className={classes.goal}>
            <p>
              <strong>ניהול יעיל של המלאי:</strong> ממשק ידידותי המספק מידע ברור
              וממוקד על מוצרים מוכנים במלאי
            </p>
          </div>
          <div className={classes.goal}>
            <p>
              <strong>הזמנות אוטומטיות:</strong> מערכת מתקדמת להזמנות מוסדרות
              ויעילות, מקצרת את זמן ההזמנה ומפחיתה טעויות
            </p>
          </div>
          <div className={classes.goal}>
            <p>
              <strong>ניהול סקיצה:</strong> אפשרות להעלאת וניהול סקיצה למוצרים
              שונים לצורך הצגה ויזואלית ברורה ללקוח
            </p>
          </div>
          <div className={classes.goal}>
            <p>
              <strong>שמירה על מידות:</strong> הזנה ועדכון קל של מידות מוצרים,
              כולל בדיקות תקינות קלט
            </p>
          </div>
          <div className={classes.goal}>
            <p>
              <strong>שמירת סוגי פרופיל:</strong> הזנה ועדכון של סוגי הפרופיל
              במערכת בצורה מסודרת.
            </p>
          </div>
          <div className={classes.goal}>
            <p>
              <strong>חישוב עלויות:</strong> מערכת לחישוב עלות זכוכית ופרזול לפי
              מידות וסוגי חומרים
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
