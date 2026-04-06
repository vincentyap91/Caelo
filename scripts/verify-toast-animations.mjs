/**

 * Browser verification: push toasts — stack/exit animation + hover pause/resume timer + multi independence.

 * Prereq: npm run build && npx vite preview --host 127.0.0.1 --port 4173

 * Run: node scripts/verify-toast-animations.mjs

 */

import { chromium } from 'playwright';



const URL = process.env.TOAST_TEST_URL || 'http://127.0.0.1:4173/';



async function main() {

    const browser = await chromium.launch();

    const context = await browser.newContext({

        viewport: { width: 1280, height: 800 },

    });

    await context.addInitScript(() => {

        sessionStorage.setItem('e2e_toast_api', '1');

        localStorage.setItem('riocity_notification_prefs_v1', JSON.stringify({ email: true, push: true, sms: true }));

    });

    const page = await context.newPage();

    await page.goto(URL, { waitUntil: 'networkidle', timeout: 120000 });



    await page.waitForFunction(

        () => window.__riocityActionNotifications && typeof window.__riocityActionNotifications.showPushNotification === 'function',

        null,

        { timeout: 60000 }

    );



    let failed = false;



    // --- Part A: stack + exit animation ---

    await page.evaluate(() => {

        window.__riocityActionNotifications.showPushNotification({ event: 'login_success', userName: 'Alpha' });

        window.__riocityActionNotifications.showPushNotification({ event: 'deposit_success', amount: 100 });

        window.__riocityActionNotifications.showPushNotification({ event: 'logout' });

    });



    await page.waitForTimeout(450);

    let totalCards = await page.locator('.push-notification-toast-enter, .push-notification-toast-exit').count();



    if (totalCards < 3) {

        console.error('FAIL A: expected 3 toast shells, got', totalCards);

        failed = true;

    }



    const firstOpacityBefore = await page

        .locator('.push-notification-toast-enter, .push-notification-toast-exit')

        .first()

        .evaluate((el) => parseFloat(getComputedStyle(el).opacity));



    await page.evaluate(() => window.__riocityActionNotifications.dismissPushNotification());

    await page.waitForTimeout(90);

    const midOpacity = await page

        .locator('.push-notification-toast-exit')

        .first()

        .evaluate((el) => parseFloat(getComputedStyle(el).opacity))

        .catch(() => null);



    await page.waitForTimeout(400);

    let remaining = await page.locator('.push-notification-toast-enter, .push-notification-toast-exit').count();



    if (midOpacity == null || midOpacity > firstOpacityBefore - 0.05) {

        console.error('FAIL A: exit opacity did not drop mid-animation.', { firstOpacityBefore, midOpacity });

        failed = true;

    }

    if (remaining > 0) {

        console.error('FAIL A: toasts still in DOM after exit.', remaining);

        failed = true;

    }



    // --- Part B: hover pauses timer; after leave, toast outlasts unpaused 6s lifetime ---

    await page.evaluate(() => {

        window.__riocityActionNotifications.showPushNotification({

            event: 'login_success',

            userName: 'HoverMe',

            __testDurationMs: 6000,

        });

    });

    await page.waitForTimeout(1000);

    const hoverTarget = page.getByText('Signed in', { exact: true }).first();

    await hoverTarget.hover();

    await page.waitForTimeout(4000);

    await page.mouse.click(120, 520);

    await page.waitForTimeout(3500);



    const stillThereAt8s = await page.getByText('Welcome back', { exact: false }).count();

    if (stillThereAt8s < 1) {

        console.error('FAIL B: toast should still be visible ~8s after show when hover extended 6s timer (got no welcome copy).');

        failed = true;

    }



    await page.waitForTimeout(5000);

    const goneAfterResume = await page.getByText('HoverMe', { exact: false }).count();

    if (goneAfterResume > 0) {

        console.error('FAIL B: toast should dismiss after resume + remaining time.');

        failed = true;

    }



    // --- Part C: two toasts — only top (newest) hovered; shorter bottom expires on time ---

    await page.evaluate(() => {

        window.__riocityActionNotifications.showPushNotification({

            event: 'deposit_success',

            amount: 1,

            __testDurationMs: 3500,

        });

        window.__riocityActionNotifications.showPushNotification({

            event: 'login_success',

            userName: 'TopToast',

            __testDurationMs: 9000,

        });

    });

    await page.waitForTimeout(400);

    const topToast = page
        .locator('.push-notification-toast-enter, .push-notification-toast-exit')
        .filter({ hasText: 'TopToast' })
        .first();

    await topToast.hover();

    await page.waitForTimeout(4000);



    const depositGone = (await page.getByText('Deposit successful', { exact: true }).count()) === 0;

    if (!depositGone) {

        console.error('FAIL C: deposit toast should auto-dismiss while top toast is hovered.');

        failed = true;

    }



    const topStill = (await page.getByText('TopToast', { exact: false }).count()) > 0;

    if (!topStill) {

        console.error('FAIL C: hovered top toast should still be visible after shorter sibling dismisses.');

        failed = true;

    }



    // Click away so hover reliably ends (layout can shift when a sibling toast unmounts).
    await page.mouse.click(120, 520);

    await page.waitForTimeout(11000);

    const anyLeft = await page.locator('.push-notification-toast-enter, .push-notification-toast-exit').count();

    if (anyLeft > 0) {

        console.error('FAIL C: all toasts should clear after top completes.', anyLeft);

        failed = true;

    }



    console.log(

        JSON.stringify(

            {

                partA: { totalCardsAfterShow: totalCards, firstOpacityBefore, midOpacity, remainingAfterExitAnim: remaining },

                partB: { stillThereAt8s },

                partC: { depositGone, topStill, anyLeft },

            },

            null,

            2

        )

    );



    if (!failed) {

        console.log('PASS: exit animation, hover pause/resume, and multi-toast independence.');

    } else {

        process.exitCode = 1;

    }



    await browser.close();

}



main().catch((err) => {

    console.error(err);

    process.exit(1);

});


