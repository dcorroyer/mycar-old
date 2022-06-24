<?php

namespace App\Doctrine;

use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use App\Entity\Maintenance;
use App\Entity\User;
use App\Entity\Invoice;
use App\Entity\Vehicule;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\Security\Core\Authorization\AuthorizationCheckerInterface;
use Symfony\Component\Security\Core\Security;

class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    /**
     * @var Security
     */
    private Security $security;

    /**
     * @var AuthorizationCheckerInterface
     */
    private AuthorizationCheckerInterface $auth;

    public function __construct(Security $security, AuthorizationCheckerInterface $auth)
    {
        $this->auth     = $auth;
        $this->security = $security;
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass)
    {
        $user = $this->security->getUser();

        if (
            ($resourceClass === Vehicule::class || $resourceClass === Maintenance::class || $resourceClass === Invoice::class)
            &&
            !$this->auth->isGranted('ROLE_ADMIN')
            &&
            $user instanceof User
        ) {
            $rootAlias = $queryBuilder->getRootAliases()[0];

            if ($resourceClass === Vehicule::class) {
                $queryBuilder->andWhere("$rootAlias.user = :user");
            } else if ($resourceClass === Maintenance::class) {
                $queryBuilder
                    ->join("$rootAlias.vehicule", "v")
                    ->andWhere('v.user = :user');
            } else if ($resourceClass === Invoice::class) {
                $queryBuilder
                    ->join("$rootAlias.maintenance", "m")
                    ->join("m.vehicule", "v")
                    ->andWhere('v.user = :user');
            }
            $queryBuilder->setParameter("user", $user);
        }
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, string $operationName = null)
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, string $operationName = null, array $context = [])
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }
}