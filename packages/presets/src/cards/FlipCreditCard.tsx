/**
 * FlipCreditCard — dark credit card that flips over in 3D on hover to reveal
 * the magnetic strip and CVC on the back.
 * Ported from UIverse.io (black-lizard-62) by Praashoo7.
 * Source: https://uiverse.io/Praashoo7/black-lizard-62
 * License: MIT. Attribution: Praashoo7 via UIverse.io.
 */
import type { CSSProperties } from "react";

const CHIP_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAB6VBMVEUAAACNcTiVeUKVeUOYfEaafEeUeUSYfEWZfEaykleyklaXe0SWekSZZjOYfEWYe0WXfUWXe0WcgEicfkiXe0SVekSXekSWekKYe0a9nF67m12ZfUWUeEaXfESVekOdgEmVeUWWekSniU+VeUKVeUOrjFKYfEWliE6WeESZe0GSe0WYfES7ml2Xe0WXeESUeEOWfEWcf0eWfESXe0SXfEWYekSVeUKXfEWxklawkVaZfEWWekOUekOWekSYfESZe0eXekWYfEWZe0WZe0eVeUSWeETAnmDCoWLJpmbxy4P1zoXwyoLIpWbjvXjivnjgu3bfu3beunWvkFWxkle/nmDivXiWekTnwXvkwHrCoWOuj1SXe0TEo2TDo2PlwHratnKZfEbQrWvPrWuafUfbt3PJp2agg0v0zYX0zYSfgkvKp2frxX7mwHrlv3rsxn/yzIPgvHfduXWXe0XuyIDzzISsjVO1lVm0lFitjVPzzIPqxX7duna0lVncuHTLqGjvyIHeuXXxyYGZfUayk1iyk1e2lln1zYTEomO2llrbtnOafkjFpGSbfkfZtXLhvHfkv3nqxH3mwXujhU3KqWizlFilh06khk2fgkqsjlPHpWXJp2erjVOhg0yWe0SliE+XekShhEvAn2D///+gx8TWAAAARnRSTlMACVCTtsRl7Pv7+vxkBab7pZv5+ZlL/UnU/f3SJCVe+Fx39naA9/75XSMh0/3SSkia+pil/KRj7Pr662JPkrbP7OLQ0JFOijI1MwAAAAFiS0dEorDd34wAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IDx2lsiuJAAACLElEQVRIx2NgGAXkAUYmZhZWPICFmYkRVQcbOwenmzse4MbFzc6DpIGXj8PD04sA8PbhF+CFaxEU8iWkAQT8hEVgOkTF/InR4eUVICYO1SIhCRMLDAoKDvFDVhUaEhwUFAjjSUlDdMiEhcOEItzdI6OiYxA6YqODIt3dI2DcuDBZsBY5eVTr4xMSYcyk5BRUOXkFsBZFJTQnp6alQxgZmVloUkrKYC0qqmji2WE5EEZuWB6alKoKdi35YQUQRkFYPpFaCouKIYzi6EDitJSUlsGY5RWVRGjJLyxNy4ZxqtIqqvOxaVELQwZFZdkIJVU1RSiSalAt6rUwUBdWG1CP6pT6gNqwOrgCdQyHNYR5YQFhDXj8MiK1IAeyN6aORiyBjByVTc0FqBoKWpqwRCVSgilOaY2OaUPw29qjOzqLvTAchpos47u6EZyYnngUSRwpuTe6D+6qaFQdOPNLRzOM1dzhRZyW+CZouHk3dWLXglFcFIflQhj9YWjJGlZcaKAVSvjyPrRQ0oQVKDAQHlYFYUwIm4gqExGmBSkutaVQJeomwViTJqPK6OhCy2Q9sQBk8cY0DxjTJw0lAQWK6cOKfgNhpKK7ZMpUeF3jPa28BCETamiEqJKM+X1gxvWXpoUjVIVPnwErw71nmpgiqiQGBjNzbgs3j1nus+fMndc+Cwm0T52/oNR9lsdCS24ra7Tq1cbWjpXV3sHRCb1idXZ0sGdltXNxRateRwHRAACYHutzk/2I5QAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAyMy0wMi0xM1QwODoxNToyOSswMDowMEUnN7UAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMjMtMDItMTNUMDg6MTU6MjkrMDA6MDA0eo8JAAAAKHRFWHRkYXRlOnRpbWVzdGFtcAAyMDIzLTAyLTEzVDA4OjE1OjI5KzAwOjAwY2+u1gAAAABJRU5ErkJggg==";
const CONTACTLESS_IMG =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAQAAAC0NkA6AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAg0IEzgIwaKTAAADDklEQVRYw+1XS0iUURQ+f5qPyjQflGRFEEFK76koKGxRbWyVVLSOgsCgwjZBJJYuKogSIoOonUK4q3U0WVBWFPZYiIE6kuArG3VGzK/FfPeMM/MLt99/NuHdfPd888/57jn3nvsQWWj/VcMlvMMd5KRTogqx9iCdIjUUmcGR9ImUYowyP3xNGQJoRLVaZ2DaZf8kyjEJALhI28ELioyiwC+Rc3QZwRYyO/DH51hQgWm6DMIh10KmD4u9O16K49itVoPOAmcGAWWOepXIRScAoJZ2Frro8oN+EyTT6lWkkg6msZfMSR35QTJmjU0g15tIGSJ08ZZMJkJkHpNZgSkyXosS13TkJpZ62mPIJvOSzC1bp8vRhhCakEk7G9/o4gmZdbpsTcKu0m63FbnBP9Qrc15zbkbemfgNDtEOI8NO5L5O9VYyRYgmJayZ9nPaxZrSjW4+F6Uw9yQqIiIZwhp2huQTf6OIvCZyGM6gDJBZbyXifJXr7FZjGXsdxADxI7HUJFB6iWvsIhFpkoiIiGTJfjJfiCuJg2ZEspq9EHGVpYgzKqwJqSAOEwuJQ/pxPvE3cYltJCLdxBLiSKKIE5HxJKcTRNeadxfhDiuYw44zVs1dxKwRk/uCxIiQkxKBsSctRVAge9g1E15EHE6yRUaJecRxcWlukdRIbGFOSZCMWQA/iWauIP3slREHXPyliqBcrrD71AmzZ+rD1Mt2Yr8TZc/UR4/YtFnbijnHi3UrN9vKQ9rPaJf867ZiaqDB+czeKYmd3pNa6fuI75MiC0uXXSR5aEMf7s7a6r/PudVXkjFb/SsrCRfROk0Fx6+H1i9kkTGn/E1vEmt1m089fh+RKdQ5O+xNJPUicUIjO0Dm7HwvErEr0YxeibL1StSh37STafE4I7zcBdRq1DiOkdmlTJVnkQTBTS7X1FYyvfO4piaInKbDCDaT2anLudYXCRFsQBgAcIF2/Okwgvz5+Z4tsw118dzruvIvjhTB+HOuWy8UvovEH6beitBKxDyxm9MmISKCWrzB7bSlaqGlsf0FC0gMjzTg6GgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDItMTNUMDg6MTk6NTYrMDA6MDCjlq7LAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTAyLTEzVDA4OjE5OjU2KzAwOjAw0ssWdwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wMi0xM1QwODoxOTo1NiswMDowMIXeN6gAAAAASUVORK5CYII=";

export const FlipCreditCard = ({
  brand = "MASTERCARD",
  number = "9759 2484 5269 6576",
  expiry = "1 2 / 2 4",
  holder = "BRUCE WAYNE",
  cardColor = "#171717",
}: {
  /** Brand text on the top right */
  brand?: string;
  /** Card number */
  number?: string;
  /** Expiry date text */
  expiry?: string;
  /** Card holder name */
  holder?: string;
  /** Card face color */
  cardColor?: string;
}) => (
  <>
    <style>{`
      .uv-fcc-flip-card {
        background-color: transparent;
        width: 240px;
        height: 154px;
        perspective: 1000px;
        color: white;
      }
      .uv-fcc-heading {
        position: absolute;
        letter-spacing: .2em;
        font-size: 0.5em;
        top: 2em;
        left: 18.6em;
      }
      .uv-fcc-logo {
        position: absolute;
        top: 6.8em;
        left: 11.7em;
      }
      .uv-fcc-chip {
        position: absolute;
        top: 2.3em;
        left: 1.5em;
      }
      .uv-fcc-contactless {
        position: absolute;
        top: 3.5em;
        left: 12.4em;
      }
      .uv-fcc-number {
        position: absolute;
        font-weight: bold;
        font-size: .6em;
        top: 8.3em;
        left: 1.6em;
      }
      .uv-fcc-valid-thru {
        position: absolute;
        font-weight: bold;
        top: 635.8em;
        font-size: .01em;
        left: 140.3em;
      }
      .uv-fcc-date {
        position: absolute;
        font-weight: bold;
        font-size: 0.5em;
        top: 13.6em;
        left: 3.2em;
      }
      .uv-fcc-name {
        position: absolute;
        font-weight: bold;
        font-size: 0.5em;
        top: 16.1em;
        left: 2em;
      }
      .uv-fcc-strip {
        position: absolute;
        background-color: black;
        width: 15em;
        height: 1.5em;
        top: 2.4em;
        background: repeating-linear-gradient(
          45deg,
          #303030,
          #303030 10px,
          #202020 10px,
          #202020 20px
        );
      }
      .uv-fcc-mstrip {
        position: absolute;
        background-color: rgb(255, 255, 255);
        width: 8em;
        height: 0.8em;
        top: 5em;
        left: .8em;
        border-radius: 2.5px;
      }
      .uv-fcc-sstrip {
        position: absolute;
        background-color: rgb(255, 255, 255);
        width: 4.1em;
        height: 0.8em;
        top: 5em;
        left: 10em;
        border-radius: 2.5px;
      }
      .uv-fcc-code {
        font-weight: bold;
        text-align: center;
        margin: .2em;
        color: black;
      }
      .uv-fcc-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
      }
      .uv-fcc-flip-card:hover .uv-fcc-inner {
        transform: rotateY(180deg);
      }
      .uv-fcc-front, .uv-fcc-back {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        border-radius: 1rem;
        box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 2px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -1px 0px inset;
        background-color: var(--uv-fcc-card-color);
      }
      .uv-fcc-back {
        transform: rotateY(180deg);
      }
    `}</style>
    <div
      className="uv-fcc-flip-card"
      style={{ "--uv-fcc-card-color": cardColor } as CSSProperties}
    >
      <div className="uv-fcc-inner">
        <div className="uv-fcc-front">
          <p className="uv-fcc-heading">{brand}</p>
          <svg className="uv-fcc-logo" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="36" height="36" viewBox="0 0 48 48">
            <path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"></path>
            <path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"></path>
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"></path>
          </svg>
          <svg version="1.1" className="uv-fcc-chip" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="30px" height="30px" viewBox="0 0 50 50" xmlSpace="preserve">
            <image width="50" height="50" x="0" y="0" href={CHIP_IMG}></image>
          </svg>
          <svg version="1.1" className="uv-fcc-contactless" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="20px" height="20px" viewBox="0 0 50 50" xmlSpace="preserve">
            <image width="50" height="50" x="0" y="0" href={CONTACTLESS_IMG}></image>
          </svg>
          <p className="uv-fcc-number">{number}</p>
          <p className="uv-fcc-valid-thru">VALID THRU</p>
          <p className="uv-fcc-date">{expiry}</p>
          <p className="uv-fcc-name">{holder}</p>
        </div>
        <div className="uv-fcc-back">
          <div className="uv-fcc-strip"></div>
          <div className="uv-fcc-mstrip"></div>
          <div className="uv-fcc-sstrip">
            <p className="uv-fcc-code">***</p>
          </div>
        </div>
      </div>
    </div>
  </>
);
