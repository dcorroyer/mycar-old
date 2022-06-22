<?php

namespace App\DataFixtures;

use App\Entity\Invoice;
use App\Entity\Maintenance;
use App\Entity\User;
use App\Entity\Vehicule;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    protected UserPasswordHasherInterface $hasher;

    public function __construct(UserPasswordHasherInterface $hasher)
    {
        $this->hasher = $hasher;
    }

    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr-FR');
        $admin = new User();
        $hash  = $this->hasher->hashPassword($admin, "password");

        $admin->setLastname("Corroyer")
            ->setFirstname("Dylan")
            ->setEmail("admin@api.com")
            ->setPassword($hash)
            ->setRoles(["ROLE_ADMIN"])
        ;

        $manager->persist($admin);

        for($c = 0; $c < 10; $c++) {
            $user = new User();
            $hash = $this->hasher->hashPassword($user, "password");

            $user->setLastname($faker->lastName())
                ->setFirstname($faker->firstName())
                ->setEmail($faker->email())
                ->setPassword($hash)
            ;

            $manager->persist($user);

            for($v = 0; $v < mt_rand(1, 3); $v++) {
                $vehicule = new Vehicule();

                $vehicule->setType($faker->randomElement([
                        Vehicule::TYPE['MOTORCYCLE'],
                        Vehicule::TYPE['CAR'],
                        Vehicule::TYPE['SCOOTER']
                    ]))
                    ->setIdentification($faker->creditCardNumber())
                    ->setBrand($faker->name())
                    ->setReference($faker->name())
                    ->setModelyear($faker->numberBetween(1900, 2022))
                    ->setUser($user)
                ;

                $manager->persist($vehicule);

                for($m = 0; $m < mt_rand(0, 10); $m++) {
                    $maintenance = new Maintenance();

                    $chrono_invoices = 1;

                    $maintenance->setType($faker->randomElement([
                            Maintenance::TYPE['MAINTENANCE'],
                            Maintenance::TYPE['REPAIR'],
                            Maintenance::TYPE['RESTORATION'],
                        ]))
                        ->setDescription($faker->text())
                        ->setDate($faker->dateTimeBetween('-2 years', '+2 years'))
                        ->setAmount($faker->randomFloat(2, 10, 2500))
                        ->setVehicule($vehicule)
                    ;

                    $manager->persist($maintenance);

                    for($i = 0; $i < mt_rand(1 , 3); $i++) {
                        $invoice = new Invoice();

                        $invoice
                            ->setFile($faker->name())
                            ->setMaintenance($maintenance)
                            ->setChrono($chrono_invoices)
                        ;

                        $chrono_invoices++;

                        $manager->persist($invoice);
                    }
                }
            }
        }

        $manager->flush();
    }
}