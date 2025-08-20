// Mini nav

class NavComponent extends HTMLElement {
    connectedCallback() {
        this.innerHTML=`
        <nav class="custom-nav">
            <ul>
                <li><a href="../index.html">Landing</a></li>
                <li><a href="/packs/index.html">Packs</a></li>
                <li><a href="/trivia/index.html">Trivia</a></li>
            </ul>
        </nav>
        `;
    }
}
customElements.define('nav-component', NavComponent);
