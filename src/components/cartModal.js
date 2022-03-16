const bag = function () {
    if (!Element.prototype.closest) {
        if (!Element.prototype.matches) {
            Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
        }
        Element.prototype.closest = function (s) {
            const el = this;
            const ancestor = this;
            if (!document.documentElement.contains(el)) return null;
            do {
                if (ancestor.matches(s)) return ancestor;
                ancestor = ancestor.parentElement;
            } while (ancestor !== null);
            return null;
        };
    }

    const settings = {
        speedOpen: 50,
        speedClose: 350,
        activeClass: 'is-active',
        visibleClass: 'is-visible',
        selectorTarget: '[data-bag-target]',
        selectorTrigger: '[data-bag-trigger]',
        selectorClose: '[data-bag-close]',
    };


    const toggleccessibility = function (event) {
        if (event.getAttribute('aria-expanded') === 'true') {
            event.setAttribute('aria-expanded', false);
        } else {
            event.setAttribute('aria-expanded', true);
        }
    };

    const openbag = function (trigger) {
        let target = document.getElementById(trigger.getAttribute('aria-controls'));
        target.classList.add(settings.activeClass);
        document.documentElement.style.overflow = 'hidden';
        toggleccessibility(trigger);
        setTimeout(function () {
            target.classList.add(settings.visibleClass);
        }, settings.speedOpen);
    };

    const closebag = function (event) {
        let closestParent = event.closest(settings.selectorTarget),
            childrenTrigger = document.querySelector('[aria-controls="' + closestParent.id + '"');
        closestParent.classList.remove(settings.visibleClass);
        document.documentElement.style.overflow = '';
        toggleccessibility(childrenTrigger);
        setTimeout(function () {
            closestParent.classList.remove(settings.activeClass);
        }, settings.speedClose);
    };

    const clickHandler = function (event) {
        let toggle = event.target,
            open = toggle.closest(settings.selectorTrigger),
            close = toggle.closest(settings.selectorClose);
        if (open) {
            let loader = document.getElementById('loader');
            loader.classList.add('loader-is-visible');
            setTimeout(() => {
                loader.classList.remove('loader-is-visible');
                openbag(open);
            }, 1000);
        }
        if (close) {
            closebag(close);
        }
        if (open || close) {
            event.preventDefault();
        }
    };

    const keydownHandler = function (event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            var bags = document.querySelectorAll(settings.selectorTarget),
                i;
            for (i = 0; i < bags.length; ++i) {
                if (bags[i].classList.contains(settings.activeClass)) {
                    closebag(bags[i]);
                }
            }
        }
    };
    document.addEventListener('click', clickHandler, false);
    document.addEventListener('keydown', keydownHandler, false);
};
bag();